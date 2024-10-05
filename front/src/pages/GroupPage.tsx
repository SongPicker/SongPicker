import React, { useCallback, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import GroupList from '../components/template/group/GroupList';
import GroupDetail from '../components/template/group/GroupDetail';
import { checkConnectionStatus } from '../services/connectionService';
import ConnectionModal from '../components/template/commons/ConnectionModal';

const GroupPage = () => {
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
    // 필요에 따라 주기적으로 상태를 체크하는 로직을 추가할 수 있습니다.
  }, []);

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

  return (
    <>
      <Routes>
        <Route index element={<GroupList />} />
        <Route
          path=":teamId/*"
          element={
            <GroupDetail
              isConnected={isConnected}
              onShowConnectionModal={handleShowConnectionModal}
            />
          }
        />
      </Routes>
      <ConnectionModal
        isVisible={showConnectionModal}
        onClose={handleCloseConnectionModal}
        message={connectionModalMessage}
        icon={modalIcon}
        autoCloseDelay={autoCloseDelay}
      />
    </>
  );
};

export default GroupPage;
