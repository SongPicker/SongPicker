import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import MusicItem from '../../organisms/commons/MusicItem';
import MusicDetailModal from '../commons/MusicDetailModal';
import { IoMdRefreshCircle } from 'react-icons/io';
import { TbMoodSadSquint } from 'react-icons/tb';

import {
  getPersonalRecommendations,
  getSongDetail,
  SongDetail,
} from '../../../services/songservices';

// Props 타입 정의
type Props = {
  onShowNotification: (title: string, description: string) => void;
  onShowConnectionModal: (message: string) => void;
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

// 에러 처리를 위한 유틸리티 함수
const handleApiError = (error: unknown, message: string) => {
  console.error(message, error);
  return message;
};

const RecomMusicList = ({ onShowNotification, onShowConnectionModal }: Props) => {
  const [currentPage, setCurrentPage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState<RecommendedSong | null>(null);
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

  // 추천 곡 목록을 가져오는 함수
  const fetchRecommendations = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const response = await getPersonalRecommendations();
      if (response.code === 'SO102') {
        if (Array.isArray(response.data) && response.data.length > 0) {
          setRecommendedSongs(prevSongs => {
            if (JSON.stringify(prevSongs) !== JSON.stringify(response.data)) {
              return response.data;
            }
            return prevSongs;
          });
          setCurrentPage(0);
        } else {
          setError('현재 추천할 노래가 없어요.\n잠시 후 다시 시도해 주세요!');
        }
      } else {
        setError('노래 정보를 불러오는 데 문제가 발생했어요.\n다시 시도해 볼까요?');
      }
    } catch (err) {
      setError('일시적으로 노래 정보를 불러올 수 없어요.\n잠시 후 다시 시도해 주세요!');
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // 컴포넌트 마운트 시 추천 곡 목록 가져오기
  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

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
      fetchRecommendations();
      onShowNotification('♪ 추천리스트 갱신 중', '새로운 추천 목록을 불러오고 있어요.');
    }
  }, [fetchRecommendations, onShowNotification, isRefreshing]);

  // 좋아요 버튼 핸들러
  const handleLike = useCallback(() => {
    onShowNotification(
      '찜 완료!',
      '찜한곡 리스트에 추가되었습니다!\n찜보관함에서 목록을 확인하실 수 있습니다.'
    );
  }, [onShowNotification]);

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
        const errorMessage = handleApiError(error, '노래 상세 정보를 불러오는데 실패했습니다.');
        onShowNotification('오류 발생', errorMessage);
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
                    title={item.title}
                    artist={item.singer}
                    imageUrl={item.coverImage}
                    onLike={handleLike}
                    onShowConnectionModal={onShowConnectionModal}
                    onItemClick={() => handleItemClick(item)}
                  />
                </div>
              ))}
          </div>
        </div>
      )),
    [recommendedSongs, totalPages, handleLike, onShowConnectionModal, handleItemClick]
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
