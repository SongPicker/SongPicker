import React, { useCallback, useState, useEffect, useMemo } from 'react';
import MusicItem from '../organisms/commons/MusicItem';
import { deleteLike, registerLike } from '../../services/songService';

interface SearchResultItem {
  songId: number;
  number: string;
  title: string;
  singer: string;
  coverImage: string;
  isLike: boolean;
  likeId: number | null;
}

type Tab = 'all' | 'song' | 'singer';

type Props = {
  keyword: string;
  searchResults: {
    songSearchList: SearchResultItem[];
    singerSearchList: SearchResultItem[];
  };

  onShowConnectionModal: (
    message: string,
    icon: 'link' | 'spinner' | 'reservation',
    autoCloseDelay?: number
  ) => void;

  onItemClick: (music: SearchResultItem) => void;
  isLoading: boolean;
  error: string | null;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  isConnected: boolean;
  onSeeMore: () => void;
};

const SearchMain = ({
  keyword,
  searchResults,
  onShowConnectionModal,
  onItemClick,
  isLoading,
  error,
  activeTab,
  onTabChange,
  isConnected,
  onSeeMore,
}: Props) => {
  const [songs, setSongs] = useState<SearchResultItem[]>([]);
  const [singers, setSingers] = useState<SearchResultItem[]>([]);

  useEffect(() => {
    setSongs(searchResults.songSearchList);
    setSingers(searchResults.singerSearchList);
  }, [searchResults]);

  const updateSongState = useCallback((updatedSong: SearchResultItem) => {
    const updateList = (prevList: SearchResultItem[]) =>
      prevList.map(item => (item.songId === updatedSong.songId ? updatedSong : item));

    setSongs(updateList);
    setSingers(updateList);
  }, []);

  const handleLikeToggle = useCallback(
    async (song: SearchResultItem) => {
      const newIsLike = !song.isLike;
      const updatedSong = { ...song, isLike: newIsLike };
      updateSongState(updatedSong);

      try {
        if (newIsLike) {
          const result = await registerLike(song.songId);
          if (result.code === 'LI100' || result.message === '찜 등록 성공') {
            updateSongState({ ...updatedSong, likeId: result.likeId || result.body });
            onShowConnectionModal('찜 목록에 추가되었습니다.', 'reservation', 2000);
          } else {
            throw new Error('찜 등록 실패');
          }
        } else {
          const result = await deleteLike(Number(song.number));
          if (result.code === 'LI101' || result.message === '찜 삭제 성공') {
            updateSongState({ ...updatedSong, likeId: null });
            onShowConnectionModal('찜 목록에서 제거되었습니다.', 'reservation', 2000);
          } else {
            throw new Error('찜 해제 실패');
          }
        }
      } catch (error) {
        console.error('찜 등록/해제 중 오류 발생:', error);
        updateSongState({ ...song, isLike: !newIsLike });
        onShowConnectionModal('찜 등록/해제 중 오류가 발생했습니다.', 'link', 2000);
      }
    },
    [updateSongState, onShowConnectionModal]
  );

  const renderMusicItems = useCallback(
    (items: SearchResultItem[], limit?: number) => {
      const itemsToRender = limit ? items.slice(0, limit) : items;
      return itemsToRender.map(item => (
        <MusicItem
          key={item.songId}
          id={item.songId.toString()}
          number={item.number.toString()}
          title={item.title}
          artist={item.singer}
          imageUrl={item.coverImage}
          isLiked={item.isLike}
          onLikeToggle={() => handleLikeToggle(item)}
          onShowConnectionModal={(message: string) => onShowConnectionModal(message, 'link')}
          isConnected={isConnected}
          onItemClick={() => onItemClick(item)}
        />
      ));
    },
    [handleLikeToggle, onShowConnectionModal, isConnected, onItemClick]
  );

  const renderSearchSection = useMemo(
    () => (title: string, items: SearchResultItem[], type: Exclude<Tab, 'all'>) => (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">
            {title} 검색결과 {items.length}개
          </h3>
          {activeTab === 'all' && items.length > 5 && (
            <button
              className="text-sm text-[#9747FF]"
              onClick={() => {
                onTabChange(type);
                onSeeMore();
              }}
            >
              더보기
            </button>
          )}
        </div>
        {renderMusicItems(items, activeTab === 'all' ? 5 : undefined)}
      </div>
    ),
    [activeTab, onSeeMore, onTabChange, renderMusicItems]
  );

  if (isLoading) return <p className="text-gray-500">검색 중...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      {keyword && (
        <>
          {(activeTab === 'all' || activeTab === 'song') &&
            renderSearchSection('곡', songs, 'song')}
          {(activeTab === 'all' || activeTab === 'singer') &&
            renderSearchSection('가수', singers, 'singer')}
          {songs.length === 0 && singers.length === 0 && (
            <p className="text-gray-500">"{keyword}"에 대한 검색 결과가 없습니다.</p>
          )}
        </>
      )}
    </div>
  );
};
export default SearchMain;
