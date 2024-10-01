import React from 'react';
import { useNavigate } from 'react-router-dom';
import RecentSearch from '../organisms/search/RecentSearch';
import MusicItem from '../organisms/commons/MusicItem';

type Props = {
  keyword: string;
  searchResults: {
    songSearchList: Array<any>;
    singerSearchList: Array<any>;
  };
  onShowConnectionModal: (message: string) => void;
  onItemClick: (music: { id: string; title: string; artist: string; imageUrl: string }) => void;
  isLoading: boolean;
  error: string | null;
  activeTab: 'all' | 'song' | 'singer';
  onTabChange: (tab: 'all' | 'song' | 'singer') => void;
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
}: Props) => {
  const navigate = useNavigate();

  const renderMusicItems = (items: Array<any>, limit?: number) => {
    const itemsToRender = limit ? items.slice(0, limit) : items;
    return itemsToRender.map(item => (
      <MusicItem
        key={item.number}
        id={item.number.toString()}
        title={item.title}
        artist={item.singer}
        imageUrl={item.coverImage}
        onLike={() => {}}
        onShowConnectionModal={onShowConnectionModal}
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
