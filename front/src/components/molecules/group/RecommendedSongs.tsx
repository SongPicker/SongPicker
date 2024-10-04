import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  getSongDetail,
  SongDetail,
  registerLike,
  deleteLike,
  getTeamRecommendations,
} from '../../../services/songService';
import MusicItem from '../../organisms/commons/MusicItem';
import { IoMdRefreshCircle } from 'react-icons/io';
import { TbMoodSadSquint } from 'react-icons/tb';
import CustomAlert from '../../template/commons/CustomAlertModal';
import MusicDetailModal from '../../template/commons/MusicDetailModal';

interface RecommendedSongsProps {
  teamId: number;
  teamName: string;
}

interface RecommendedSong {
  songId: number;
  number: string;
  title: string;
  singer: string;
  coverImage: string;
  isLike: boolean;
  likeId: number | null;
}

const RecommendedSongs: React.FC<RecommendedSongsProps> = ({ teamId, teamName }) => {
  const [recommendedSongs, setRecommendedSongs] = useState<RecommendedSong[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ title: string; description: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSongDetail, setSelectedSongDetail] = useState<SongDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const adjustItemsPerPage = useCallback(() => {
    const height = window.innerHeight;
    if (height <= 740) {
      setItemsPerPage(5);
    } else if (height <= 900) {
      setItemsPerPage(6);
    } else {
      setItemsPerPage(7);
    }
  }, []);

  useEffect(() => {
    adjustItemsPerPage();
    window.addEventListener('resize', adjustItemsPerPage);
    return () => window.removeEventListener('resize', adjustItemsPerPage);
  }, [adjustItemsPerPage]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(recommendedSongs.length / itemsPerPage)),
    [recommendedSongs.length, itemsPerPage]
  );

  const fetchRecommendedSongs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getTeamRecommendations(teamId);
      if (response.code === 'SO102') {
        // 예시 코드, 실제 API 응답에 맞게 조정 필요
        setRecommendedSongs(response.data);
      } else {
        throw new Error(response.message || '추천 곡을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      setError('추천 곡 정보를 불러오는 데 문제가 발생했어요.\n다시 시도해 볼까요?');
    } finally {
      setIsLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchRecommendedSongs();
  }, [fetchRecommendedSongs]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.style.transition = currentPage === 0 ? 'none' : 'transform 0.3s ease-in-out';
      container.style.transform = `translateX(-${currentPage * 100}%)`;
    }
  }, [currentPage]);

  const showAlert = (title: string, description: string) => {
    setAlert({ title, description });
  };

  const handleRefresh = () => {
    fetchRecommendedSongs();
    showAlert('♪ 목록 갱신 중', '추천 곡 목록을 새로 불러오고 있어요.');
  };

  const handleLikeToggle = useCallback(async (song: RecommendedSong) => {
    try {
      if (song.isLike) {
        const result = await deleteLike(Number(song.number));
        if (result.code === 'LI101' || result.message === '찜 삭제 성공') {
          setRecommendedSongs(prevSongs =>
            prevSongs.map(s => (s.songId === song.songId ? { ...s, isLike: false } : s))
          );
          showAlert('찜 해제', `${song.title}이(가) 찜 보관함에서 제거되었습니다.`);
        } else {
          showAlert('알림', '찜 해제 상태를 확인할 수 없습니다.');
        }
      } else {
        const result = await registerLike(song.songId);
        if (result.code === 'LI100' || result.message === '찜 등록 성공') {
          setRecommendedSongs(prevSongs =>
            prevSongs.map(s => (s.songId === song.songId ? { ...s, isLike: true } : s))
          );
          showAlert('찜 완료', `${song.title}이(가) 찜 보관함에 추가되었습니다.`);
        } else if (result.code === 'LI000') {
          showAlert('알림', `${song.title}은(는) 이미 찜 보관함에 있습니다.`);
        } else {
          showAlert('알림', '찜 등록 상태를 확인할 수 없습니다.');
        }
      }
    } catch (error) {
      console.error('찜 등록/해제 중 오류 발생:', error);
      showAlert('오류 발생', '찜 등록/해제 중 문제가 발생했습니다. 다시 시도해 주세요.');
    }
  }, []);

  const handleItemClick = useCallback(async (songId: number) => {
    setIsLoadingDetail(true);
    try {
      const response = await getSongDetail(songId);
      if (response.code === 'SO100') {
        setSelectedSongDetail(response.data);
        setIsModalOpen(true);
      } else {
        throw new Error(response.message || '노래 상세 정보를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      showAlert('오류 발생', '노래 상세 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoadingDetail(false);
    }
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    const container = containerRef.current;
    if (container) {
      container.dataset.startX = touch.clientX.toString();
      container.style.transition = 'none';
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      const container = containerRef.current;
      if (container && container.dataset.startX) {
        const deltaX = touch.clientX - parseFloat(container.dataset.startX);
        const maxDelta = window.innerWidth * 0.3;
        const limitedDeltaX = Math.max(Math.min(deltaX, maxDelta), -maxDelta);
        container.style.transform = `translateX(calc(-${currentPage * 100}% + ${limitedDeltaX}px))`;
      }
    },
    [currentPage]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const container = containerRef.current;
      if (container && container.dataset.startX) {
        const deltaX = e.changedTouches[0].clientX - parseFloat(container.dataset.startX);
        const threshold = window.innerWidth * 0.2;
        if (Math.abs(deltaX) > threshold) {
          if (deltaX > 0 && currentPage > 0) {
            setCurrentPage(prev => prev - 1);
          } else if (deltaX < 0 && currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1);
          }
        }
        container.style.transition = 'transform 0.3s ease-out';
        container.style.transform = `translateX(-${currentPage * 100}%)`;
        delete container.dataset.startX;
      }
    },
    [currentPage, totalPages]
  );

  const renderMusicItems = useMemo(() => {
    return Array.from({ length: totalPages }).map((_, pageIndex) => (
      <div key={pageIndex} className="w-full flex-shrink-0">
        <div className="space-y-3  py-3 ">
          {recommendedSongs
            .slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage)
            .map(song => (
              <MusicItem
                key={song.songId}
                id={song.songId.toString()}
                title={song.title}
                artist={song.singer}
                imageUrl={song.coverImage}
                isLiked={song.isLike}
                onLikeToggle={() => handleLikeToggle(song)}
                onShowConnectionModal={() => {}}
                onItemClick={() => handleItemClick(song.songId)}
              />
            ))}
        </div>
      </div>
    ));
  }, [recommendedSongs, totalPages, itemsPerPage, handleLikeToggle, handleItemClick]);

  if (isLoading) {
    return <div className="text-center py-4">로딩 중...</div>;
  }

  if (error) {
    return (
      <div className="w-full h-full bg-[#333] rounded-md flex items-center justify-center">
        <div className="text-center p-6">
          <TbMoodSadSquint className="text-5xl mx-auto mb-4" />
          <h4 className="text-xl font-bold text-white mb-2">앗! 문제가 발생했어요</h4>
          <p className="text-gray-300 mb-4 whitespace-pre-line">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            다시 시도하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="w-full text-lg font-semibold">{teamName}그룹의 추천 곡 리스트</h3>
        <IoMdRefreshCircle className="size-8 cursor-pointer" onClick={handleRefresh} />
      </div>
      {recommendedSongs.length === 0 ? (
        <div className="text-center py-4">추천 곡이 없습니다!</div>
      ) : (
        <div className="w-full relative overflow-y-auto overflow-hidden bg-[#333]/50 rounded-md">
          <div
            ref={containerRef}
            className="flex h-full transition-transform duration-300 ease-in-out"
            style={{ width: '93%' }}
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
            className={`mx-1 w-2 h-2 rounded-full  transition-all duration-300  ${
              currentPage === index ? 'bg-purple-500' : 'bg-gray-500'
            }`}
          />
        ))}
      </div>
      {alert && (
        <CustomAlert
          title={alert.title}
          description={alert.description}
          onClose={() => setAlert(null)}
        />
      )}
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

export default RecommendedSongs;
