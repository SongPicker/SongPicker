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
  onItemClick: (song: Song) => void;
};

const ThemeSongList = ({
  themedSongs,
  isRefreshing,
  isConnected,
  onRefresh,
  onLikeToggle,
  onShowConnectionModal,
  onItemClick,
}: Props) => {
  if (!themedSongs) {
    return <div className="text-white">로딩 중...</div>;
  }

  const { themeTitle, list } = themedSongs;

  return (
    <div className="h-full flex flex-col bg-gradient-to-r from-primary to-secondary">
      {/* 고정된 헤더 (테마 제목 및 새로고침 아이콘) */}
      <div className="flex-shrink-0 p-3">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-lg text-white">#{themeTitle}</p>
          <IoMdRefreshCircle
            className={`text-white size-7 cursor-pointer ${isRefreshing ? 'animate-spin' : ''}`}
            onClick={onRefresh}
          />
        </div>
      </div>

      {/* 스크롤 가능한 노래 목록 */}
      <div className="flex-grow overflow-y-auto">
        <div className="p-3">
          {list.map((song: Song) => (
            <div key={song.songId} className="mb-2">
              <MusicItem
                id={song.songId.toString()}
                number={song.number.toString()}
                title={song.title}
                artist={song.singer}
                imageUrl={song.coverImage || ''}
                isLiked={song.isLike}
                onLikeToggle={() => onLikeToggle(song)}
                onShowConnectionModal={onShowConnectionModal}
                onItemClick={() => onItemClick(song)}
                isConnected={isConnected}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSongList;
