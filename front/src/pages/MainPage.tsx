import React, { useCallback, useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import KaraokeLinkMode from '../components/organisms/MainOrganism/KaraokeLinkMode';
import RecomMusicList from '../components/template/Maintemplate/RecomMusicList';
import CustomAlert from '../components/template/commons/CustomAlertModal';
import ConnectionModal from '../components/template/commons/ConnectionModal';
import UserStatisticsBanner from '../components/template/Maintemplate/UserStatisticsBanner';
import RecomThemeBanner from '../components/template/Maintemplate/RecomThemeBanner';
import { checkConnectionStatus, disconnectService } from '../services/connectionService';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchNickname } from '../services/memberSevice';
import TwoBtnAlertModal from '../components/template/commons/TwoBtnAlertModal';

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

  useEffect(() => {
    fetchConnectionStatus();
    const intervalId = setInterval(fetchConnectionStatus, 1200000);
    return () => clearInterval(intervalId);
  }, [fetchConnectionStatus]);

  useEffect(() => {
    // QrScanPage에서 전달받은 상태 확인
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

  // 임시 테마 노래 1
  const kpopTheme = {
    title: '신나는 K-POP 여자 아이돌 노래',
    gradientColors: 'bg-gradient-to-r from-red-400 to-pink-500',
    themeLink: '/theme/k-pop',
    items: [
      { imageUrl: '', number: '154353', title: 'Ditto', artist: 'NewJeans' },
      { imageUrl: '', number: '234233', title: 'Hype Boy', artist: 'NewJeans' },
      { imageUrl: '', number: '343424', title: 'OMG', artist: 'NewJeans' },
    ],
  };

  // 임시 테마 노래 2
  const balladeTheme = {
    title: '감성적인 발라드 모음',
    gradientColors: 'bg-gradient-to-r from-blue-400 to-purple-500',
    themeLink: '/theme/ballad',
    items: [
      { imageUrl: '', number: '167575', title: '사랑은 늘 도망가', artist: '임영웅' },
      { imageUrl: '', number: '276535', title: '취중고백', artist: '김민석' },
      {
        imageUrl: '',
        number: '334242',
        title: '그날에 나는 맘이 편했을까',
        artist: '이예준',
      },
    ],
  };

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
          <RecomThemeBanner {...kpopTheme} />
          <RecomThemeBanner {...balladeTheme} />
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
