import React from 'react';
import { ThemedSongRecommendation, Song } from '../../../services/songService';
import MusicItem from '../commons/MusicItem';
import { IoMdRefreshCircle } from 'react-icons/io';

type Props = {
  themedSongs: ThemedSongRecommendation | null;
  isRefreshing: boolean;
  isConnected: boolean;
  onRefresh: () => void;
  onLikeToggle: (song: Song) => void;
  onReservation: (song: Song) => void;
  onShowConnectionModal: (message: string) => void;
};

const ThemeSongList = ({
  themedSongs,
  isRefreshing,
  isConnected,
  onRefresh,
  onLikeToggle,
  onReservation,
  onShowConnectionModal,
}: Props) => {
  if (!themedSongs) {
    return <div className="text-white">로딩 중...</div>;
  }

  const { themeTitle, list } = themedSongs;

  return (
    <div>
      {/* 노래리스트 */}
      <div
        className="w-full p-3 rounded-xl min-h-screen"
        style={{ background: 'linear-gradient(to right, #9747FF, #575ED2)' }}
      >
        {/* 테마제목 */}
        <div className="flex justify-between">
          <p className="font-semibold text-lg text-white mb-4">#{themeTitle}</p>
          <IoMdRefreshCircle
            className={`text-white size-7 cursor-pointer ${isRefreshing ? 'animate-spin' : ''}`}
            onClick={onRefresh}
          />
        </div>

        {/* 노래 목록 */}
        {list.map((song: Song) => (
          <MusicItem
            key={song.songId}
            id={song.songId.toString()}
            number={song.number.toString()}
            title={song.title}
            artist={song.singer}
            imageUrl={song.coverImage || ''}
            isLiked={song.isLike}
            onLikeToggle={() => onLikeToggle(song)}
            onShowConnectionModal={onShowConnectionModal}
            onItemClick={() => onReservation(song)}
            isConnected={isConnected}
          />
        ))}
      </div>
    </div>
  );
};

export default ThemeSongList;
