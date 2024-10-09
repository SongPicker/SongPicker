import React, { useCallback, useEffect, useState } from 'react';
import { checkConnectionStatus, disconnectService } from '../services/connectionService';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchNickname } from '../services/memberSevice';
import {
  getRandomThemes,
  getThemedSongRecommendations,
  ThemedSongRecommendation,
} from '../services/songService';
import TwoBtnAlertModal from '../components/template/commons/TwoBtnAlertModal';
import KaraokeLinkMode from '../components/organisms/MainOrganism/KaraokeLinkMode';
import MainLayout from '../layouts/MainLayout';
import RecomMusicList from '../components/template/Maintemplate/RecomMusicList';
import CustomAlert from '../components/template/commons/CustomAlertModal';
import ConnectionModal from '../components/template/commons/ConnectionModal';
import UserStatisticsBanner from '../components/template/Maintemplate/UserStatisticsBanner';
import RecomThemeBanner from '../components/template/Maintemplate/RecomThemeBanner';

const MainPage = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState({ title: '', description: '' });
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [connectionModalMessage, setConnectionModalMessage] = useState('');
  const [modalIcon, setModalIcon] = useState<'link' | 'spinner' | 'reservation'>('link');
  const [autoCloseDelay, setAutoCloseDelay] = useState<number | undefined>(undefined);
  const [isConnected, setIsConnected] = useState(false); // 연결 상태 관리
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [nickname, setNickname] = useState<string>('');
  const location = useLocation();
  const [mode, setMode] = useState<string | null>(null);
  const [teamName, setTeamName] = useState<string | null>(null);
  const navigate = useNavigate();
  const [randomThemes, setRandomThemes] = useState<string[]>([]);
  const [themeRecommendations, setThemeRecommendations] = useState<ThemedSongRecommendation[]>([]);

  // 테마 페이지로 이동하는 함수
  const handleViewMore = useCallback(
    (theme: string) => {
      navigate(`/theme?theme=${encodeURIComponent(theme)}`);
    },
    [navigate]
  );

  // 닉네임 가져오는 api
  useEffect(() => {
    const getNickname = async () => {
      const responseData = await fetchNickname();

      if (responseData.code === 'ME110') {
        setNickname(responseData.data);
      } else {
        console.error('닉네임 조회 실패:', responseData);
      }
    };

    getNickname();
  }, []);

  // 연결 상태를 가져오는 함수
  const fetchConnectionStatus = useCallback(async () => {
    try {
      const response = await checkConnectionStatus();
      console.log('Fetched connection status:', response);
      setIsConnected(response.data.isConnected);
      setMode(response.data.mode);
      setTeamName(response.data.teamName);
    } catch (error) {
      console.error('Failed to fetch connection status:', error);
      setIsConnected(false);
      setMode(null);
      setTeamName(null);
    }
  }, []);

  // 연결 상태를 주기적으로 확인 (30분마다)
  useEffect(() => {
    fetchConnectionStatus();
    const intervalId = setInterval(fetchConnectionStatus, 1800000);
    return () => clearInterval(intervalId);
  }, [fetchConnectionStatus]);

  // QrScanPage에서 전달받은 상태 확인
  useEffect(() => {
    if (location.state) {
      const { isConnected: newIsConnected, mode: newMode, teamName: newTeamName } = location.state;
      if (newIsConnected !== undefined) {
        setIsConnected(newIsConnected);
      }
      if (newMode) {
        setMode(newMode);
      }
      if (newTeamName) {
        setTeamName(newTeamName);
      }
    }
  }, [location]);

  // 연결 해제 처리
  const handleDisconnect = async () => {
    try {
      const response = await disconnectService();
      if (response.code === 'CO103') {
        setIsConnected(false);
        console.log('연결이 해제되었습니다.');
      } else {
        throw new Error('Disconnect failed');
      }
    } catch (error) {
      console.error('Failed to disconnect:', error);
    } finally {
      setShowDisconnectModal(false); // 모달 닫기
    }
  };

  // 랜덤 테마 및 테마별 노래 추천 가져오기
  const fetchRandomThemesAndSongs = useCallback(async () => {
    try {
      const themesResponse = await getRandomThemes();
      if (themesResponse.code === 'SO106' && Array.isArray(themesResponse.data)) {
        setRandomThemes(themesResponse.data);

        const recommendationsPromises = themesResponse.data.map((theme: string) =>
          getThemedSongRecommendations(theme)
        );
        const recommendationsResponses = await Promise.all(recommendationsPromises);

        const validRecommendations = recommendationsResponses
          .filter(response => response.code === 'SO105' && response.data)
          .map((response, index) => ({
            ...response.data,
            theme: themesResponse.data[index], // theme을 명확히 추가
            list: response.data.list.slice(0, 3), // 각 테마당 3곡만 선택
          }));

        setThemeRecommendations(validRecommendations);
      }
    } catch (error) {
      console.error('Failed to fetch random themes and songs:', error);
    }
  }, []);

  // 컴포넌트가 마운트될 때 랜덤 테마 및 노래 목록 가져오기
  useEffect(() => {
    fetchRandomThemesAndSongs();
  }, [fetchRandomThemesAndSongs]);

  // 알림 표시 함수
  const handleShowNotification = (title: string, description: string) => {
    setNotificationMessage({ title, description });
    setShowNotification(true);
  };

  // 알림 닫기 함수
  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  // 연결 모달 표시 함수
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

  // 연결 모달 닫기 함수
  const handleCloseConnectionModal = () => {
    setShowConnectionModal(false);
  };

  // 연결 모드 클릭 처리
  const handleLinkmodeClick = () => {
    if (isConnected) {
      setShowDisconnectModal(true); // 연결 중일 때 모달 표시
    } else {
      navigate('/member-select'); // 연결이 되어 있지 않을 때만 '/member-select'로 이동
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col py-4 w-full">
        {/* 노래방 연결 */}
        <div className="px-2 mb-8">
          <KaraokeLinkMode
            isConnected={isConnected}
            mode={mode}
            teamName={teamName}
            onDisconnect={handleDisconnect}
            onLinkmodeClick={handleLinkmodeClick}
          />
        </div>

        {/* 사용자 맞춤 추천곡 */}
        <div className="px-2 mb-8">
          <RecomMusicList
            nickname={nickname}
            isConnected={isConnected}
            onShowNotification={handleShowNotification}
            onShowConnectionModal={handleShowConnectionModal}
          />
        </div>

        {/* 테마 추천 */}
        <div className="px-2">
          {themeRecommendations.map((themeRec, index) => (
            <RecomThemeBanner
              key={index}
              title={themeRec.themeTitle}
              gradientColors={`bg-gradient-to-r from-primary to-secondary`}
              items={themeRec.list.map(song => ({
                imageUrl: song.coverImage || '',
                number: song.number.toString(),
                title: song.title,
                artist: song.singer,
              }))}
              onMoreClick={() => handleViewMore(randomThemes[index])}
            />
          ))}
        </div>

        {/* 사용자 통계 배너 */}
        <div>
          <UserStatisticsBanner nickname={nickname} />
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

      {showDisconnectModal && (
        <TwoBtnAlertModal
          isVisible={showDisconnectModal}
          onClose={() => setShowDisconnectModal(false)}
          onConfirm={handleDisconnect}
          message="기존의 연결을 해제하시겠습니까?"
        />
      )}
    </MainLayout>
  );
};

export default MainPage;
