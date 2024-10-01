import React, { useCallback, useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import KaraokeLinkMode from '../components/organisms/MainOrganism/KaraokeLinkMode';
import RecomMusicList from '../components/template/Maintemplate/RecomMusicList';
import CustomAlert from '../components/template/commons/CustomAlertModal';
import ConnectionModal from '../components/template/commons/ConnectionModal';
import UserStatisticsBanner from '../components/template/Maintemplate/UserStatisticsBanner';
import RecomThemeBanner from '../components/template/Maintemplate/RecomThemeBanner';
import { checkConnectionStatus } from '../services/connection';

const MainPage = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState({ title: '', description: '' });
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [connectionModalMessage, setConnectionModalMessage] = useState('');
  const [modalIcon, setModalIcon] = useState<'link' | 'spinner' | 'reservation'>('link');
  const [autoCloseDelay, setAutoCloseDelay] = useState<number | undefined>(undefined);
  const [isConnected, setIsConnected] = useState(false); // 연결 상태 관리

  // 연결 상태를 가져오는 함수
  const fetchConnectionStatus = useCallback(async () => {
    try {
      const response = await checkConnectionStatus();
      console.log('Fetched connection status:', response);
      setIsConnected(response.body);
    } catch (error) {
      console.error('Failed to fetch connection status:', error);
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    fetchConnectionStatus(); // 컴포넌트 마운트 시 상태 확인
    const intervalId = setInterval(fetchConnectionStatus, 30000); // 30초마다 상태 확인

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 해제
  }, [fetchConnectionStatus]);

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

  return (
    <MainLayout>
      <div className="flex flex-col py-4 w-full">
        {/* 노래방 연결 */}
        <div className="px-2 mb-8">
          <KaraokeLinkMode isConnected={isConnected} />
        </div>

        {/* 사용자 맞춤 추천곡 */}
        <div className="px-2 mb-8">
          <RecomMusicList
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
          <UserStatisticsBanner />
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
    </MainLayout>
  );
};

export default MainPage;
