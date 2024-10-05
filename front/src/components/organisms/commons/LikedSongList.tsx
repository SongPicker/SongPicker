import React, { useEffect, useState } from 'react';
import { getLikedSongs, LikedSong, deleteLike } from '../../../services/songService';
import MusicItem from './MusicItem';

type LikedSongListProps = {
  isConnected: boolean;
  onShowConnectionModal: (
    message: string,
    icon: 'link' | 'spinner' | 'reservation',
    autoCloseDelay?: number
  ) => void;
};

const LikedSongList = ({ isConnected, onShowConnectionModal }: LikedSongListProps) => {
  const [likedSongs, setLikedSongs] = useState<LikedSong[]>([]);

  const handleShowConnectionModal = (message: string) => {
    onShowConnectionModal(message, 'link');
  };

  useEffect(() => {
    async function fetchLikedSongs() {
      try {
        const likedSongsData = await getLikedSongs();
        console.log('API 응답 데이터:', likedSongsData);

        // 응답 데이터가 배열인지 확인 후 설정
        if (likedSongsData && Array.isArray(likedSongsData)) {
          setLikedSongs(likedSongsData);
        } else {
          setLikedSongs([]); // 응답이 예상과 다를 경우 빈 배열로 설정
        }
      } catch (error) {
        console.error('Failed to fetch liked songs', error);
        setLikedSongs([]); // 오류 발생 시 빈 배열로 설정
      }
    }

    fetchLikedSongs();
  }, []);

  const handleLikeToggle = async (song: LikedSong) => {
    try {
      if (song.likeId) {
        await deleteLike(Number(song.number));
        setLikedSongs(prevSongs => prevSongs.filter(item => item.likeId !== song.likeId));
        console.log('찜 해제 성공:', song.title);
      }
    } catch (error) {
      console.error('찜 해제 실패:', error);
    }
  };

  return (
    <>
      {likedSongs.length > 0 ? (
        likedSongs.map(song => (
          <MusicItem
            key={song.likeId ?? song.number}
            id={song.number.toString()}
            number={song.number.toString()}
            title={song.title}
            artist={song.singer}
            imageUrl={song.coverImage}
            isLiked={true}
            onLikeToggle={() => handleLikeToggle(song)}
            isConnected={isConnected}
            onShowConnectionModal={handleShowConnectionModal}
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
