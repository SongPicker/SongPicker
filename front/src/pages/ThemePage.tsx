import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Alltheme from '../components/template/genre/Alltheme';
import CustomAlert from '../components/template/commons/CustomAlertModal';
import ConnectionModal from '../components/template/commons/ConnectionModal';
import { checkConnectionStatus } from '../services/connectionService';
import {
  getAllThemes,
  getThemedSongRecommendations,
  registerLike,
  deleteLike,
  reserveSong,
  Song,
  SongDetail,
  ThemedSongRecommendation,
  getSongDetail,
} from '../services/songService';
import MusicDetailModal from '../components/template/commons/MusicDetailModal';

const ThemePage = () => {
  const [searchParams] = useSearchParams();
  const theme = searchParams.get('theme');
  const [isConnected, setIsConnected] = useState(false);
  const [allThemes, setAllThemes] = useState<string[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [themedSongs, setThemedSongs] = useState<ThemedSongRecommendation | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 알림 상태
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState({ title: '', description: '' });

  // 연결 모달 상태
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [connectionModalMessage, setConnectionModalMessage] = useState('');
  const [modalIcon, setModalIcon] = useState<'link' | 'spinner' | 'reservation'>('link');
  const [autoCloseDelay, setAutoCloseDelay] = useState<number | undefined>(undefined);

  // MusicDetailModal 관련 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSongDetail, setSelectedSongDetail] = useState<SongDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const handleShowNotification = (title: string, description: string) => {
    setNotificationMessage({ title, description });
    setShowNotification(true);
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  const handleShowConnectionModal = (
    message: string,
    icon: 'link' | 'spinner' | 'reservation' = 'link',
    delay?: number
  ) => {
    setConnectionModalMessage(message);
    setModalIcon(icon);
    setAutoCloseDelay(delay);
    setShowConnectionModal(true);
  };

  const handleCloseConnectionModal = () => {
    setShowConnectionModal(false);
  };

  useEffect(() => {
    if (theme) {
      // theme 값에 따라 탭 및 관련 데이터를 설정
      setSelectedTheme(theme);
      fetchThemedSongs(theme); // 선택된 테마의 노래 불러오기
    }
  }, [theme]);

  // 곡 선택 핸들러
  const handleItemClick = useCallback(
    async (song: Song) => {
      setIsLoadingDetail(true);
      try {
        const response = await getSongDetail(song.songId);
        if (response.code === 'SO100') {
          setSelectedSongDetail(response.data);
          setIsModalOpen(true);
        } else {
          throw new Error(response.message || '노래 상세 정보를 불러오는데 실패했습니다.');
        }
      } catch (error) {
        handleShowNotification('오류 발생', '노래 상세 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoadingDetail(false);
      }
    },
    [handleShowNotification]
  );

  // 연결상태 확인 API
  const fetchConnectionStatus = useCallback(async () => {
    try {
      const response = await checkConnectionStatus();
      setIsConnected(response.data.isConnected);
    } catch (error) {
      console.error('Failed to fetch connection status:', error);
      setIsConnected(false);
    }
  }, []);

  // 모든 테마 가져오기
  const fetchAllThemes = useCallback(async () => {
    try {
      const response = await getAllThemes();
      setAllThemes(response.data);
      if (response.data.length > 0) {
        setSelectedTheme(response.data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch all themes:', error);
      handleShowNotification('오류', '테마 목록을 불러오는데 실패했습니다.');
    }
  }, []);

  const getStoredThemedSongs = useCallback((theme: string) => {
    const storedData = sessionStorage.getItem(`themedSongs_${theme}`);
    if (storedData) {
      const { songs, timestamp } = JSON.parse(storedData);
      const now = new Date().getTime();
      const hoursPassed = (now - timestamp) / (1000 * 60 * 60);

      if (hoursPassed > 24) {
        return null;
      }
      return songs;
    }
    return null;
  }, []);

  const storeThemedSongs = useCallback((theme: string, songs: ThemedSongRecommendation) => {
    const data = {
      songs,
      timestamp: new Date().getTime(),
    };
    sessionStorage.setItem(`themedSongs_${theme}`, JSON.stringify(data));
  }, []);

  const fetchThemedSongs = useCallback(
    async (theme: string, forceRefresh: boolean = false) => {
      if (!forceRefresh) {
        const storedSongs = getStoredThemedSongs(theme);
        if (storedSongs) {
          setThemedSongs(storedSongs);
          return;
        }
      }

      try {
        setIsRefreshing(true);
        const response = await getThemedSongRecommendations(theme);
        setThemedSongs(response.data);
        storeThemedSongs(theme, response.data);
      } catch (error) {
        console.error('Failed to fetch themed songs:', error);
        handleShowNotification('오류', '테마별 노래를 불러오는데 실패했습니다.');
      } finally {
        setIsRefreshing(false);
      }
    },
    [getStoredThemedSongs, storeThemedSongs]
  );

  useEffect(() => {
    fetchConnectionStatus();
    fetchAllThemes();
  }, [fetchConnectionStatus, fetchAllThemes]);

  useEffect(() => {
    if (selectedTheme) {
      fetchThemedSongs(selectedTheme);
    }
  }, [selectedTheme, fetchThemedSongs]);

  const handleThemeSelect = (theme: string) => {
    setSelectedTheme(theme);
  };

  const handleRefresh = useCallback(() => {
    if (selectedTheme) {
      fetchThemedSongs(selectedTheme, true);
    }
  }, [selectedTheme, fetchThemedSongs]);

  const handleLikeToggle = useCallback(
    async (song: Song) => {
      try {
        if (song.isLike) {
          const result = await deleteLike(Number(song.number));
          if (result.code === 'LI101' || result.message === '찜 삭제 성공') {
            setThemedSongs(prev =>
              prev
                ? {
                    ...prev,
                    list: prev.list.map(item =>
                      item.songId === song.songId ? { ...item, isLike: false, likeId: null } : item
                    ),
                  }
                : null
            );
            handleShowNotification('찜 해제', `${song.title}이(가) 찜 보관함에서 제거되었습니다.`);
          }
        } else {
          const result = await registerLike(song.songId);
          if (result.code === 'LI100' || result.message === '찜 등록 성공') {
            setThemedSongs(prev =>
              prev
                ? {
                    ...prev,
                    list: prev.list.map(item =>
                      item.songId === song.songId
                        ? { ...item, isLike: true, likeId: result.likeId || result.body }
                        : item
                    ),
                  }
                : null
            );
            handleShowNotification('찜 완료', `${song.title}이(가) 찜 보관함에 추가되었습니다.`);
          }
        }
        // 상태 업데이트 후 세션 스토리지에 저장
        if (themedSongs && selectedTheme) {
          storeThemedSongs(selectedTheme, themedSongs);
        }
      } catch (error) {
        console.error('찜 등록/해제 중 오류 발생:', error);
        handleShowNotification(
          '오류 발생',
          '찜 등록/해제 중 문제가 발생했습니다. 다시 시도해 주세요.'
        );
      }
    },
    [themedSongs, selectedTheme, storeThemedSongs]
  );

  const handleReservation = useCallback(
    async (song: Song) => {
      if (!isConnected) {
        handleShowConnectionModal(
          '노래방 기기와 연결되어 있지 않습니다. 연결 후 다시 시도해주세요.'
        );
        return;
      }

      try {
        const result = await reserveSong(Number(song.number));
        if (result.code === 'CO104' || result.message === '노래 예약 성공') {
          handleShowNotification('예약 완료', `${song.title}이(가) 예약되었습니다.`);
        } else {
          throw new Error('Reservation failed');
        }
      } catch (error) {
        console.error('노래 예약 중 오류 발생:', error);
        handleShowNotification(
          '오류 발생',
          '노래 예약 중 문제가 발생했습니다. 다시 시도해 주세요.'
        );
      }
    },
    [isConnected]
  );

  return (
    <MainLayout title="테마별 노래 추천">
      <div className="h-full flex flex-col">
        <div className="flex-grow overflow-hidden p-4">
          <Alltheme
            themes={allThemes}
            selectedTheme={selectedTheme}
            onThemeSelect={handleThemeSelect}
            themedSongs={themedSongs}
            isRefreshing={isRefreshing}
            isConnected={isConnected}
            onRefresh={handleRefresh}
            onLikeToggle={handleLikeToggle}
            onReservation={handleReservation}
            onShowNotification={handleShowNotification}
            onShowConnectionModal={handleShowConnectionModal}
            onItemClick={handleItemClick}
          />
        </div>
      </div>

      {showNotification && (
        <CustomAlert
          title={notificationMessage.title}
          description={notificationMessage.description}
          onClose={handleCloseNotification}
        />
      )}
      <ConnectionModal
        isVisible={showConnectionModal}
        onClose={handleCloseConnectionModal}
        message={connectionModalMessage}
        icon={modalIcon}
        autoCloseDelay={autoCloseDelay}
      />

      {selectedSongDetail && (
        <MusicDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          isLoading={isLoadingDetail}
          songDetail={selectedSongDetail}
          height="80vh"
        />
      )}
    </MainLayout>
  );
};

export default ThemePage;
