import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import MusicItem from '../../organisms/commons/MusicItem';
import MusicDetailModal from '../commons/MusicDetailModal';
import { IoMdRefreshCircle } from 'react-icons/io';
import { TbMoodSadSquint } from 'react-icons/tb';

import {
  getPersonalRecommendations,
  getSongDetail,
  registerLike,
  deleteLike,
  SongDetail,
} from '../../../services/songService';

// Props 타입 정의
type Props = {
  onShowNotification: (title: string, description: string) => void;
  onShowConnectionModal: (message: string) => void;
  isConnected: boolean;
};

// 추천 곡 인터페이스 정의
interface RecommendedSong {
  songId: number;
  number: string;
  title: string;
  singer: string;
  coverImage: string;
  isLike: boolean;
  likeId: number | null;
}

const RecomMusicList = ({ onShowNotification, onShowConnectionModal, isConnected }: Props) => {
  const [currentPage, setCurrentPage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recommendedSongs, setRecommendedSongs] = useState<RecommendedSong[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedSongDetail, setSelectedSongDetail] = useState<SongDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const itemsPerPage = 5;
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(recommendedSongs.length / itemsPerPage)),
    [recommendedSongs.length]
  );

  // 에러 메시지 컴포넌트
  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="w-full h-[300px] bg-[#333] rounded-md flex items-center justify-center">
      <div className="text-center p-6">
        <TbMoodSadSquint className="text-6xl mx-auto mb-4" />
        <h4 className="text-xl font-bold text-white mb-2">앗! 문제가 발생했어요</h4>
        <p className="text-gray-300 mb-4 whitespace-pre-line">{message}</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          disabled={isRefreshing}
        >
          {isRefreshing ? '시도 중...' : '다시 시도하기'}
        </button>
      </div>
    </div>
  );

  // 세션 스토리지에서 추천 곡 목록을 가져오는 함수
  const getStoredRecommendations = useCallback(() => {
    const storedData = sessionStorage.getItem('recommendedSongs');
    if (storedData) {
      const { songs, timestamp } = JSON.parse(storedData);
      const now = new Date().getTime();
      const hoursPassed = (now - timestamp) / (1000 * 60 * 60);

      // 24시간이 지났다면 null을 반환하여 새로운 데이터를 fetch하도록 함
      if (hoursPassed > 24) {
        return null;
      }
      return songs;
    }
    return null;
  }, []);

  // 세션 스토리지에 추천 곡 목록을 저장하는 함수
  const storeRecommendations = useCallback((songs: RecommendedSong[]) => {
    const data = {
      songs,
      timestamp: new Date().getTime(),
    };
    sessionStorage.setItem('recommendedSongs', JSON.stringify(data));
  }, []);

  // 추천 곡 목록을 가져오는 함수
  const fetchRecommendations = useCallback(
    async (forceRefresh: boolean = false) => {
      if (!forceRefresh) {
        const storedSongs = getStoredRecommendations();
        if (storedSongs) {
          setRecommendedSongs(storedSongs);
          return;
        }
      }

      try {
        const response = await getPersonalRecommendations();
        if (response.code === 'SO102' && Array.isArray(response.data)) {
          setRecommendedSongs(response.data);
          storeRecommendations(response.data);
        }
      } catch (err) {
        console.error('일시적으로 노래 정보를 불러올 수 없습니다.');
        setError('일시적으로 노래 정보를 불러올 수 없습니다.');
      }
    },
    [getStoredRecommendations, storeRecommendations]
  );

  // 컴포넌트 마운트 시 추천 곡 목록 가져오기
  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  // 좋아요 토글 핸들러 (찜 등록/해제)
  const handleLikeToggle = useCallback(
    async (song: RecommendedSong) => {
      try {
        if (song.isLike) {
          // 찜 해제 API 호출
          if (song.number) {
            const result = await deleteLike(Number(song.number));
            if (result.code === 'LI101' || result.message === '찜 삭제 성공') {
              const updatedSongs = recommendedSongs.map(item =>
                item.songId === song.songId ? { ...item, isLike: false, likeId: null } : item
              );
              setRecommendedSongs(updatedSongs);
              storeRecommendations(updatedSongs);
              onShowNotification('찜 해제', `${song.title}이(가) 찜 보관함에서 제거되었습니다.`);
            } else {
              console.warn('Unexpected API response:', result);
              onShowNotification('알림', '찜 해제 상태를 확인할 수 없습니다.');
            }
          } else {
            console.warn('Invalid song number');
            onShowNotification('알림', '찜 해제할 수 없습니다.');
          }
        } else {
          // 찜 등록 API 호출
          const result = await registerLike(song.songId);
          if (result.code === 'LI100' || result.message === '찜 등록 성공') {
            const updatedSongs = recommendedSongs.map(item =>
              item.songId === song.songId
                ? { ...item, isLike: true, likeId: result.likeId || result.body }
                : item
            );
            setRecommendedSongs(updatedSongs);
            storeRecommendations(updatedSongs);
            onShowNotification('찜 완료', `${song.title}이(가) 찜 보관함에 추가되었습니다.`);
          } else if (result.code === 'LI000') {
            console.log('Song was already liked');
            onShowNotification('알림', `${song.title}은(는) 이미 찜 보관함에 있습니다.`);
          } else {
            console.warn('Unexpected API response:', result);
            onShowNotification('알림', '찜 등록 상태를 확인할 수 없습니다.');
          }
        }
      } catch (error) {
        console.error('찜 등록/해제 중 오류 발생:', error);
        onShowNotification('오류 발생', '찜 등록/해제 중 문제가 발생했습니다. 다시 시도해 주세요.');

        // API 요청 실패 시 상태를 원래대로 되돌립니다.
        setRecommendedSongs(prevSongs =>
          prevSongs.map(item =>
            item.songId === song.songId ? { ...item, isLike: !song.isLike } : item
          )
        );
      }
    },
    [onShowNotification, recommendedSongs, storeRecommendations]
  );

  // 페이지 변경 시 컨테이너 위치 조정
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.style.transition = currentPage === 0 ? 'none' : 'transform 0.3s ease-in-out';
      container.style.transform = `translateX(-${currentPage * 100}%)`;
    }
  }, [currentPage]);

  // 새로고침 버튼 핸들러
  const handleRefresh = useCallback(() => {
    if (!isRefreshing) {
      setIsRefreshing(true);
      fetchRecommendations(true).then(() => {
        setIsRefreshing(false);
        onShowNotification('♪ 추천리스트 갱신 완료', '새로운 추천 목록을 불러왔습니다.');
      });
    }
  }, [fetchRecommendations, onShowNotification, isRefreshing]);

  // 곡 선택 핸들러
  const handleItemClick = useCallback(
    async (music: RecommendedSong) => {
      setIsLoadingDetail(true);
      try {
        const response = await getSongDetail(music.songId);
        if (response.code === 'SO100') {
          setSelectedSongDetail(response.data);
          setIsModalOpen(true);
        } else {
          throw new Error(response.message || '노래 상세 정보를 불러오는데 실패했습니다.');
        }
      } catch (error) {
        onShowNotification('오류 발생', '노래 상세 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoadingDetail(false);
      }
    },
    [onShowNotification]
  );

  // 터치 이벤트 핸들러
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    const container = containerRef.current;
    if (container) {
      container.dataset.startX = touch.clientX.toString();
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      const container = containerRef.current;
      if (container && container.dataset.startX) {
        const deltaX = touch.clientX - parseFloat(container.dataset.startX);
        container.style.transform = `translateX(calc(-${currentPage * 100}% + ${deltaX}px))`;
      }
    },
    [currentPage]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const container = containerRef.current;
      if (container && container.dataset.startX) {
        const deltaX = e.changedTouches[0].clientX - parseFloat(container.dataset.startX);
        if (Math.abs(deltaX) > 50) {
          if (deltaX > 0 && currentPage > 0) {
            setCurrentPage(prev => prev - 1);
          } else if (deltaX < 0 && currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1);
          }
        }
        container.style.transform = `translateX(-${currentPage * 100}%)`;
        delete container.dataset.startX;
      }
    },
    [currentPage, totalPages]
  );

  // 음악 아이템 렌더링
  const renderMusicItems = useMemo(
    () =>
      Array.from({ length: totalPages }).map((_, pageIndex) => (
        <div key={pageIndex} className="w-full flex-shrink-0">
          <div className="py-3 px-1">
            {recommendedSongs
              .slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage)
              .map((item, index) => (
                <div key={item.number} className={index !== 0 ? 'mt-3' : ''}>
                  <MusicItem
                    id={item.number.toString()}
                    number={item.number}
                    title={item.title}
                    artist={item.singer}
                    imageUrl={item.coverImage}
                    isLiked={item.isLike}
                    onLikeToggle={() => handleLikeToggle(item)}
                    onShowConnectionModal={onShowConnectionModal}
                    onItemClick={() => handleItemClick(item)}
                    isConnected={isConnected}
                  />
                </div>
              ))}
          </div>
        </div>
      )),
    [
      recommendedSongs,
      totalPages,
      handleLikeToggle,
      onShowConnectionModal,
      handleItemClick,
      isConnected,
    ]
  );

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="w-full text-xl font-semibold">김해피님의 취향저격 선곡리스트</h3>
        <IoMdRefreshCircle
          className={`size-8 cursor-pointer ${isRefreshing ? 'animate-spin' : ''}`}
          onClick={handleRefresh}
        />
      </div>
      {error ? (
        <ErrorMessage message={error} />
      ) : (
        <div className="w-full relative overflow-hidden bg-[#333] rounded-md">
          <div
            ref={containerRef}
            className="flex transition-transform duration-300 ease-in-out"
            style={{ width: `${totalPages * 23.5}%` }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {renderMusicItems}
          </div>
        </div>
      )}
      <div className="mt-4 flex justify-center items-center">
        {Array.from({ length: totalPages }).map((_, index) => (
          <div
            key={index}
            className={`mx-1 w-2 h-2 rounded-full ${currentPage === index ? 'bg-purple-500' : 'bg-gray-500'}`}
          />
        ))}
      </div>
      {selectedSongDetail && (
        <MusicDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          songDetail={selectedSongDetail}
          isLoading={isLoadingDetail}
          height="80vh"
        />
      )}
    </div>
  );
};

export default React.memo(RecomMusicList);
