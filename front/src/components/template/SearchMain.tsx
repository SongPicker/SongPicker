import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecentSearch from '../organisms/search/RecentSearch';
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

type Props = {
  keyword: string;
  searchResults: {
    songSearchList: Array<any>;
    singerSearchList: Array<any>;
  };
  onShowConnectionModal: (message: string) => void;
  onItemClick: (music: SearchResultItem) => void;
  isLoading: boolean;
  error: string | null;
  activeTab: 'all' | 'song' | 'singer';
  onTabChange: (tab: 'all' | 'song' | 'singer') => void;
  isConnected: boolean;
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
}: Props) => {
  const navigate = useNavigate();
  const [songs, setSongs] = useState<SearchResultItem[]>(searchResults.songSearchList);

  const handleLikeToggle = useCallback(async (song: SearchResultItem) => {
    const newIsLike = !song.isLike;

    // 즉시 UI 업데이트
    setSongs(prevSongs =>
      prevSongs.map(item => (item.songId === song.songId ? { ...item, isLike: newIsLike } : item))
    );

    try {
      if (newIsLike) {
        // 찜 등록 API 호출
        const result = await registerLike(song.songId);
        setSongs(prevSongs =>
          prevSongs.map(item =>
            item.songId === song.songId
              ? { ...item, isLike: true, likeId: result.likeId || result.body }
              : item
          )
        );
      } else {
        // 찜 해제 API 호출
        if (song.likeId) {
          await deleteLike(song.likeId);
          setSongs(prevSongs =>
            prevSongs.map(item =>
              item.songId === song.songId ? { ...item, isLike: false, likeId: null } : item
            )
          );
        }
      }
    } catch (error) {
      console.error('찜 등록/해제 중 오류 발생:', error);

      // 실패 시 원래 상태로 되돌립니다.
      setSongs(prevSongs =>
        prevSongs.map(item =>
          item.songId === song.songId ? { ...item, isLike: !newIsLike } : item
        )
      );
    }
  }, []);

  const renderMusicItems = (items: Array<any>, limit?: number) => {
    const itemsToRender = limit ? items.slice(0, limit) : items;
    return itemsToRender.map(item => (
      <MusicItem
        key={item.number}
        id={item.number.toString()}
        number={item.number.toString()}
        title={item.title}
        artist={item.singer}
        imageUrl={item.coverImage}
        isLiked={item.isLike}
        onLikeToggle={() => handleLikeToggle(item)}
        onShowConnectionModal={onShowConnectionModal}
        isConnected={isConnected}
        onItemClick={() => onItemClick(item)}
      />
    ));
  };

  const renderSearchSection = (title: string, items: Array<any>, type: 'song' | 'singer') => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">
          {title} 검색결과 {items.length}개
        </h3>
        {activeTab === 'all' && items.length > 4 && (
          <button
            className="text-sm text-[#9747FF]"
            onClick={() => {
              onTabChange(type);
              navigate(`/search?keyword=${encodeURIComponent(keyword)}&tab=${type}`);
            }}
          >
            더보기
          </button>
        )}
      </div>
      {renderMusicItems(items, activeTab === 'all' ? 4 : undefined)}
    </div>
  );

  return (
    <div>
      {!keyword && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="font-medium text-[#888]">최근 검색어</p>
            <button
              className="text-sm text-[#444]"
              onClick={() => {
                localStorage.removeItem('recentSearches');
                window.location.reload();
              }}
            >
              전체 삭제
            </button>
          </div>
          <RecentSearch />
        </div>
      )}

      {keyword && (
        <div className="search-results">
          {isLoading ? (
            <p className="text-gray-500">검색 중...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              {(activeTab === 'all' || activeTab === 'song') &&
                renderSearchSection('곡', searchResults.songSearchList, 'song')}
              {(activeTab === 'all' || activeTab === 'singer') &&
                renderSearchSection('가수', searchResults.singerSearchList, 'singer')}
              {searchResults.songSearchList.length === 0 &&
                searchResults.singerSearchList.length === 0 && (
                  <p className="text-gray-500">"{keyword}"에 대한 검색 결과가 없습니다.</p>
                )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchMain;
