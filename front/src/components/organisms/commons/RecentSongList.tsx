import React, { useEffect, useState } from 'react';
import MusicItem from './MusicItem';
import { RecentSong, getMyRecentSongs } from '../../../services/historyService';

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
            onLike={() => console.log(`${song.title} liked!`)}
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
