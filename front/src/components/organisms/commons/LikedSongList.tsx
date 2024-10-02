import React, { useEffect, useState } from 'react';
import { getLikedSongs, LikedSong } from '../../../services/songService';
import MusicItem from './MusicItem';

const LikedSongList = () => {
  const [likedSongs, setLikedSongs] = useState<LikedSong[]>([]);

  useEffect(() => {
    async function fetchLikedSongs() {
      try {
        const response = await getLikedSongs();
        console.log('API 응답 데이터:', response); // API 응답 데이터를 확인합니다

        setLikedSongs(response.body || []); // `response.body`가 없을 경우 빈 배열로 설정
      } catch (error) {
        console.error('Failed to fetch liked songs', error);
        setLikedSongs([]); // 오류 발생 시 빈 배열로 설정
      }
    }
    fetchLikedSongs();
  }, []);
  return (
    <>
      {likedSongs.length > 0 ? (
        likedSongs.map(song => (
          <MusicItem
            key={song.likeId ?? song.number}
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
        <p>찜한 곡이 없습니다.</p> // 데이터가 없을 때의 대체 텍스트
      )}
    </>
  );
};

export default LikedSongList;
