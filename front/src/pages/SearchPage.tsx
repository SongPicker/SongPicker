import React, { useCallback, useEffect, useMemo, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import SearchMain from '../components/template/SearchMain';
import SearchBar from '../components/molecules/search/SearchBar';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSongDetail, searchSongs, SongDetail } from '../services/songService';
import axios from 'axios';
import MusicDetailModal from '../components/template/commons/MusicDetailModal';
import { checkConnectionStatus } from '../services/connectionService';
import ConnectionModal from '../components/template/commons/ConnectionModal';

type Tab = 'all' | 'song' | 'singer';

export interface SearchResultItem {
  songId: number;
  number: string;
  title: string;
  singer: string;
  coverImage: string;
  isLike: boolean;
  likeId: number | null;
}

interface SearchResponse {
  songSearchList: SearchResultItem[];
  singerSearchList: SearchResultItem[];
}

const SearchPage = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResponse>({
    songSearchList: [],
    singerSearchList: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedSongDetail, setSelectedSongDetail] = useState<SongDetail | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [connectionModalMessage, setConnectionModalMessage] = useState('');
  const [modalIcon, setModalIcon] = useState<'link' | 'spinner' | 'reservation'>('link');
  const [autoCloseDelay, setAutoCloseDelay] = useState<number | undefined>(undefined);

  useEffect(() => {
    const fetchConnectionStatus = async () => {
      try {
        const response = await checkConnectionStatus();
        setIsConnected(response.data);
      } catch (error) {
        console.error('Failed to fetch connection status:', error);
        setIsConnected(false);
      }
    };

    fetchConnectionStatus();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get('keyword') || '';
    const tab = (queryParams.get('tab') as Tab) || 'all';
    setSearchKeyword(keyword);
    setActiveTab(tab);
    if (keyword) {
      fetchSearchResults(keyword);
    } else {
      setSearchResults({ songSearchList: [], singerSearchList: [] });
    }
  }, [location.search]);

  const fetchSearchResults = useCallback(async (keyword: string) => {
    if (keyword.trim() === '') {
      setSearchResults({ songSearchList: [], singerSearchList: [] });
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await searchSongs(keyword);

      if (response && response.data) {
        const { songSearchList, singerSearchList } = response.data;
        setSearchResults({
          songSearchList: songSearchList || [],
          singerSearchList: singerSearchList || [],
        });
      } else {
        console.warn('Unexpected API response structure:', response);
        setSearchResults({ songSearchList: [], singerSearchList: [] });
      }
    } catch (error) {
      console.error('검색 결과를 가져오는 중 오류 발생:', error);
      handleSearchError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearchError = useCallback((error: unknown) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        setError('접근 권한이 없습니다. 로그인이 필요할 수 있습니다.');
      } else {
        setError(`검색 중 오류가 발생했습니다: ${error.response?.statusText || '알 수 없는 오류'}`);
      }
    } else {
      setError('알 수 없는 오류가 발생했습니다.');
    }
    setSearchResults({ songSearchList: [], singerSearchList: [] });
  }, []);

  const handleSearch = useCallback(
    (keyword: string, addToHistory: boolean = false) => {
      setSearchKeyword(keyword);
      if (keyword.trim() === '') {
        navigate('/search', { replace: !addToHistory });
        setSearchResults({ songSearchList: [], singerSearchList: [] });
      } else {
        navigate(`/search?keyword=${encodeURIComponent(keyword)}&tab=${activeTab}`, {
          replace: !addToHistory,
        });
        fetchSearchResults(keyword);
      }
    },
    [navigate, activeTab, fetchSearchResults]
  );

  const handleItemClick = useCallback(async (music: SearchResultItem) => {
    setIsDetailLoading(true);
    try {
      const response = await getSongDetail(music.songId);
      if (response.code === 'SO100') {
        setSelectedSongDetail(response.data);
        setIsDetailModalOpen(true);
      } else {
        throw new Error(response.message || '노래 상세 정보를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to fetch song details:', error);
    } finally {
      setIsDetailLoading(false);
    }
  }, []);

  const handleTabChange = useCallback(
    (tab: Tab) => {
      setActiveTab(tab);
      if (searchKeyword.trim()) {
        navigate(`/search?keyword=${encodeURIComponent(searchKeyword)}&tab=${tab}`);
      }
    },
    [navigate, searchKeyword]
  );

  const handleShowConnectionModal = useCallback(
    (message: string, icon: 'link' | 'spinner' | 'reservation' = 'link', delay?: number) => {
      setConnectionModalMessage(message);
      setModalIcon(icon);
      setAutoCloseDelay(delay);
      setShowConnectionModal(true);
    },
    []
  );

  const handleCloseConnectionModal = useCallback(() => {
    setShowConnectionModal(false);
  }, []);

  const tabButtons = useMemo(
    () => (
      <div className="flex gap-[6px] mt-4 mb-4">
        <TabButton tab="all" label="전체" activeTab={activeTab} onTabChange={handleTabChange} />
        <TabButton tab="song" label="곡명" activeTab={activeTab} onTabChange={handleTabChange} />
        <TabButton tab="singer" label="가수" activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    ),
    [activeTab, handleTabChange]
  );

  return (
    <MainLayout title="노래 검색">
      <div className="flex flex-col h-full">
        <div className="sticky top-0 bg-black z-10 px-4 pt-4">
          <SearchBar
            onSearch={keyword => handleSearch(keyword, true)}
            onInputChange={keyword => handleSearch(keyword, false)}
            initialKeyword={searchKeyword}
          />
          {tabButtons}
        </div>
        <div className="flex-1 overflow-y-auto px-4">
          <SearchMain
            keyword={searchKeyword}
            searchResults={searchResults}
            isLoading={isLoading}
            error={error}
            onShowConnectionModal={handleShowConnectionModal}
            onItemClick={handleItemClick}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            isConnected={isConnected}
            onSeeMore={() => handleSearch(searchKeyword, true)}
          />
        </div>
      </div>

      {isDetailModalOpen && selectedSongDetail && (
        <MusicDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          songDetail={selectedSongDetail}
          isLoading={isDetailLoading}
          height="80vh"
        />
      )}

      <ConnectionModal
        isVisible={showConnectionModal}
        onClose={handleCloseConnectionModal}
        message={connectionModalMessage}
        icon={modalIcon}
        autoCloseDelay={autoCloseDelay}
      />
    </MainLayout>
  );
};

const TabButton = ({
  tab,
  label,
  activeTab,
  onTabChange,
}: {
  tab: Tab;
  label: string;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}) => (
  <button
    className={`text-center w-14 py-1 rounded-full ${activeTab === tab ? 'bg-[#9747FF]' : 'bg-[#1F222A]'}`}
    onClick={() => onTabChange(tab)}
  >
    {label}
  </button>
);

export default SearchPage;
