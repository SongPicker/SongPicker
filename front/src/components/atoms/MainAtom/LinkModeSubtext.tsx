import React, { useState, useEffect } from 'react';
import { checkConnectionStatus } from '../../../services/connection';

const LinkModeSubtext = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedMode, setSelectedMode] = useState('');

  useEffect(() => {
    const fetchConnectionStatus = async () => {
      try {
        const response = await checkConnectionStatus();
        setIsConnected(response.body.isConnected);
        setSelectedMode(response.body.mode);
      } catch (error) {
        console.error('Failed to fetch connection status:', error);
        setIsConnected(false);
        setSelectedMode('');
      }
    };

    fetchConnectionStatus();
    const intervalId = setInterval(fetchConnectionStatus, 120000); // 2분마다 상태 확인

    return () => clearInterval(intervalId);
  }, []);

  const getSubtext = () => {
    if (!isConnected) return '연결하고 더 많은 서비스를 이용해보세요 ';
    return `${selectedMode} 이용중`;
  };

  return <div>{getSubtext()}</div>;
};

export default LinkModeSubtext;
