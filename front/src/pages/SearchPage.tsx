import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import SearchMain from '../components/template/SearchMain';
import SearchBar from '../components/molecules/search/SearchBar';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchSongs } from '../services/songservices';
import axios from 'axios';
import MusicDetailModal from '../components/template/commons/MusicDetailModal';
import CustomAlert from '../components/template/commons/CustomAlertModal';

type Tab = 'all' | 'song' | 'singer';

const SearchPage = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [songSearchResults, setSongSearchResults] = useState<any[]>([]);
  const [singerSearchResults, setSingerSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const navigate = useNavigate();
  const location = useLocation();
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [isAlertModalOpen, setAlertModalOpen] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get('keyword') || '';
    const tab = (queryParams.get('tab') as Tab) || 'all';
    setSearchKeyword(keyword);
    setActiveTab(tab);
    if (keyword) {
      fetchSearchResults(keyword);
    }
  }, [location.search]);

  const fetchSearchResults = async (keyword: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Searching for:', keyword);
      const response = await searchSongs(keyword);
      console.log('Search response:', response);

      setSongSearchResults(response.data.songSearchList || []);
      setSingerSearchResults(response.data.singerSearchList || []);
    } catch (error) {
      console.error('검색 결과를 가져오는 중 오류 발생:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          setError('접근 권한이 없습니다. 로그인이 필요할 수 있습니다.');
        } else {
          setError(
            `검색 중 오류가 발생했습니다: ${error.response?.statusText || '알 수 없는 오류'}`
          );
        }
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
      setSongSearchResults([]);
      setSingerSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (keyword: string) => {
    if (keyword.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(keyword)}&tab=${activeTab}`);
    }
  };

  const handleShowConnectionModal = (message: string) => {
    // Implement the logic to show the connection modal
    console.log('Show connection modal:', message);
  };

  const handleItemClick = (music: {
    id: string;
    title: string;
    artist: string;
    imageUrl: string;
  }) => {
    setSelectedMusic(music);
    setDetailModalOpen(true);
  };

  const handleWishlistClick = () => {
    setAlertModalOpen(true);
  };

  const TabButton = ({ tab, label }: { tab: Tab; label: string }) => (
    <button
      className={`text-center w-14 py-1 rounded-full ${activeTab === tab ? 'bg-[#9747FF]' : 'bg-[#1F222A]'}`}
      onClick={() => handleTabChange(tab)}
    >
      {label}
    </button>
  );

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    navigate(`/search?keyword=${encodeURIComponent(searchKeyword)}&tab=${tab}`);
  };

  return (
    <MainLayout title="노래 검색">
      <div className="flex flex-col h-full">
        <div className="sticky top-0 bg-black z-10 px-4 pt-4">
          <SearchBar onSearch={handleSearch} initialKeyword={searchKeyword} />
          <div className="flex gap-[6px] mt-4 mb-4">
            <TabButton tab="all" label="전체" />
            <TabButton tab="song" label="곡명" />
            <TabButton tab="singer" label="가수" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4">
          <SearchMain
            keyword={searchKeyword}
            searchResults={{
              songSearchList: songSearchResults,
              singerSearchList: singerSearchResults,
            }}
            isLoading={isLoading}
            error={error}
            onShowConnectionModal={handleShowConnectionModal}
            onItemClick={handleItemClick}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>
      </div>

      {/* MusicDetailModal */}
      {isDetailModalOpen && selectedMusic && (
        <MusicDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          songDetail={selectedMusic}
          isLoading={false}
          height="80vh"
        />
      )}

      {/* CustomAlertModal */}
      {isAlertModalOpen && (
        <CustomAlert
          title="찜 목록에 추가"
          description="해당 곡이 찜 목록에 추가되었습니다."
          onClose={() => setAlertModalOpen(false)}
        />
      )}
    </MainLayout>
  );
};

export default SearchPage;
