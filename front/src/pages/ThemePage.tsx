import React, { useState, useCallback, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import Alltheme from '../components/template/genre/Alltheme';
import { checkConnectionStatus } from '../services/connectionService';
import { getThemedSongRecommendations, ThemedSongRecommendation } from '../services/songService';

const ThemePage = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [themedSongs, setThemedSongs] = useState<ThemedSongRecommendation[]>([]);

  // 연결 확인 API
  const fetchConnectionStatus = useCallback(async () => {
    try {
      const response = await checkConnectionStatus();
      setIsConnected(response.data.isConnected);
    } catch (error) {
      console.error('Failed to fetch connection status:', error);
      setIsConnected(false);
    }
  }, []);

  // 테마별 노래 추천 API
  const fetchThemedSongs = useCallback(async () => {
    try {
      const response = await getThemedSongRecommendations('발라드'); // 'all'은 모든 테마를 가져오는 예시입니다. 필요에 따라 변경하세요.
      console.log('Fetched themed songs:', response);
      setThemedSongs(response);
    } catch (error) {
      console.error('Failed to fetch themed songs:', error);
      setThemedSongs([]);
    }
  }, []);

  useEffect(() => {
    fetchConnectionStatus();
    fetchThemedSongs();
  }, [fetchConnectionStatus, fetchThemedSongs]);

  return (
    <MainLayout title="테마별 노래 추천">
      <div className="p-4">
        <Alltheme />
      </div>
    </MainLayout>
  );
};

export default ThemePage;
