import React, { useCallback, useEffect, useState } from 'react';
import MusicItem from './MusicItem';
import { RecentSong, getMyRecentSongs } from '../../../services/historyService';
import { deleteLike, registerLike } from '../../../services/songService';

const RecentSongList = () => {
  const [recentSongs, setRecentSongs] = useState<RecentSong[]>([]);

  useEffect(() => {
    async function fetchRecentSongs() {
      try {
        const recentSongsData = await getMyRecentSongs();
        console.log('API 응답 데이터:', recentSongsData);

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

  const handleLikeToggle = useCallback(async (song: RecentSong) => {
    const newIsLike = !song.isLike;

    // 즉시 UI 업데이트
    setRecentSongs(prevSongs =>
      prevSongs.map(item => (item.number === song.number ? { ...item, isLike: newIsLike } : item))
    );

    try {
      if (newIsLike) {
        console.log('찜 등록 요청 songId:', song.number); // songId가 제대로 전달되는지 확인
        // 찜 등록 API 호출
        const result = await registerLike(song.number);
        console.log('Register like API response:', result);

        setRecentSongs(prevSongs =>
          prevSongs.map(item =>
            item.number === song.number
              ? { ...item, isLike: true, likeId: result.likeId || result.body }
              : item
          )
        );
      } else {
        // 찜 해제 API 호출
        if (song.likeId) {
          await deleteLike(song.likeId);
          setRecentSongs(prevSongs =>
            prevSongs.map(item =>
              item.number === song.number ? { ...item, isLike: false, likeId: null } : item
            )
          );
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
    }
  }, []);

  return (
    <>
      {recentSongs.length > 0 ? (
        recentSongs.map(song => (
          <MusicItem
            key={song.likeId ?? song.number} // likeId가 null일 수 있으므로 number를 대체로 사용
            id={song.number.toString()}
            title={song.title}
            artist={song.singer}
            imageUrl={song.coverImage}
            isLiked={song.isLike}
            onLikeToggle={() => handleLikeToggle(song)}
            onShowConnectionModal={message => console.log(message)}
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
