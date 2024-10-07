import React, { useCallback, useEffect, useState } from 'react';
import MusicItem from './MusicItem';
import { RecentSong, getMyRecentSongs } from '../../../services/historyService';
import { deleteLike, registerLike } from '../../../services/songService';

type RecentSongListProps = {
  isConnected: boolean;
  onShowConnectionModal: (
    message: string,
    icon: 'link' | 'spinner' | 'reservation',
    autoCloseDelay?: number
  ) => void;
};

const RecentSongList = ({ isConnected, onShowConnectionModal }: RecentSongListProps) => {
  const [recentSongs, setRecentSongs] = useState<RecentSong[]>([]);

  const handleShowConnectionModal = (message: string) => {
    onShowConnectionModal(message, 'link');
  };

  useEffect(() => {
    async function fetchRecentSongs() {
      try {
        const recentSongsData = await getMyRecentSongs();

        if (recentSongsData && Array.isArray(recentSongsData)) {
          setRecentSongs(recentSongsData);
        } else {
          setRecentSongs([]); // 응답이 예상과 다를 경우 빈 배열로 설정
        }
      } catch (error) {
        console.error('Failed to fetch recent songs', error);
        setRecentSongs([]); // 오류 발생 시에도 안전하게 빈 배열로 설정
      }
    }

    fetchRecentSongs();
  }, []);

  const handleLikeToggle = useCallback(
    async (song: RecentSong) => {
      const newIsLike = !song.isLike;

      // 즉시 UI 업데이트
      setRecentSongs(prevSongs =>
        prevSongs.map(item => (item.number === song.number ? { ...item, isLike: newIsLike } : item))
      );

      try {
        if (newIsLike) {
          // 찜 등록 API 호출
          const result = await registerLike(Number(song.songId));

          if (result.code === 'LI100' || result.message === '찜 등록 성공') {
            setRecentSongs(prevSongs =>
              prevSongs.map(item =>
                item.songId === song.songId
                  ? { ...item, isLike: true, likeId: result.likeId || result.body }
                  : item
              )
            );
            onShowConnectionModal('찜 목록에 추가되었습니다.', 'reservation', 2000);
          } else {
            throw new Error('찜 등록 실패');
          }
        } else {
          // 찜 해제 API 호출
          if (song.number) {
            const result = await deleteLike(Number(song.number));
            if (result.code === 'LI101' || result.message === '찜 삭제 성공') {
              setRecentSongs(prevSongs =>
                prevSongs.map(item =>
                  item.number === song.number ? { ...item, isLike: false, likeId: null } : item
                )
              );
              onShowConnectionModal('찜 목록에서 제거되었습니다.', 'reservation', 2000);
            } else {
              throw new Error('찜 해제 실패');
            }
          }
        }
      } catch (error) {
        console.error('찜 등록/해제 중 오류 발생:', error);
        // 실패 시 원래 상태로 되돌립니다.
        setRecentSongs(prevSongs =>
          prevSongs.map(item =>
            item.number === song.number ? { ...item, isLike: !newIsLike } : item
          )
        );
        onShowConnectionModal('찜 등록/해제 중 오류가 발생했습니다.', 'link', 2000);
      }
    },
    [onShowConnectionModal]
  );

  return (
    <>
      {recentSongs.length > 0 ? (
        recentSongs.map(song => (
          <MusicItem
            key={song.likeId ?? song.number} // likeId가 null일 수 있으므로 number를 대체로 사용
            id={song.number.toString()}
            number={song.number.toString()}
            title={song.title}
            artist={song.singer}
            imageUrl={song.coverImage}
            isLiked={song.isLike}
            onLikeToggle={() => handleLikeToggle(song)}
            isConnected={isConnected}
            onShowConnectionModal={handleShowConnectionModal}
            onItemClick={music => console.log(`Clicked on: ${music.title}`)}
          />
        ))
      ) : (
        <p>최근 부른 곡이 없습니다.</p> // 데이터가 없을 때의 대체 텍스트
      )}
    </>
  );
};

export default RecentSongList;
