import React, { useState, useEffect, useCallback } from 'react';
import {
  getRecentSongs,
  getSongDetail,
  RecentSong,
  SongDetail,
} from '../../../services/songService';
import MusicItem from '../../organisms/commons/MusicItem';
import { IoMdRefreshCircle } from 'react-icons/io';
import { TbMoodSadSquint } from 'react-icons/tb';
import CustomAlert from '../../template/commons/CustomAlertModal';
import MusicDetailModal from '../../template/commons/MusicDetailModal';

interface RecentSongsProps {
  teamId: number;
  teamName: string;
}

const RecentSongs: React.FC<RecentSongsProps> = ({ teamId, teamName }) => {
  const [recentSongs, setRecentSongs] = useState<RecentSong[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ title: string; description: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSongDetail, setSelectedSongDetail] = useState<SongDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const fetchRecentSongs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getRecentSongs(teamId);
      if (response.code === 'HI106') {
        setRecentSongs(response.data);
      } else {
        throw new Error(response.message || '최근 부른 곡을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      setError('노래 정보를 불러오는 데 문제가 발생했어요.\n다시 시도해 볼까요?');
    } finally {
      setIsLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchRecentSongs();
  }, [fetchRecentSongs]);

  const showAlert = (title: string, description: string) => {
    setAlert({ title, description });
  };

  const handleRefresh = () => {
    fetchRecentSongs();
    showAlert('♪ 목록 갱신 중', '최근 부른 곡 목록을 새로 불러오고 있어요.');
  };

  const handleLike = () => {
    showAlert(
      '찜 완료!',
      '찜한곡 리스트에 추가되었습니다!\n찜보관함에서 목록을 확인하실 수 있습니다.'
    );
  };

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

  function handleLikeToggle(song: RecentSong): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="w-full h-screen">
      <div className="flex justify-between items-center mb-4">
        <h3 className="w-full text-xl font-semibold">{teamName}그룹의 최근 선곡 리스트</h3>
        <IoMdRefreshCircle className="size-8 cursor-pointer" onClick={handleRefresh} />
      </div>
      {recentSongs.length === 0 ? (
        <div className="text-center py-4">최근에 부른 곡이 없습니다!</div>
      ) : (
        <div className="space-y-3">
          {recentSongs.map(song => (
            <MusicItem
              key={song.number}
              id={song.number.toString()}
              title={song.title}
              artist={song.singer}
              imageUrl={song.coverImage}
              isLiked={song.isLike}
              onLikeToggle={() => handleLikeToggle(song)}
              onShowConnectionModal={() => {}}
              onItemClick={() => handleItemClick(song.number)}
            />
          ))}
        </div>
      )}
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

export default RecentSongs;
