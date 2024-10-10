import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import QrScanner from 'react-qr-scanner';
import SubTopNavbar from '../../components/molecules/commons/SubTopNavbar';
import ConnectionModal from '../../components/template/commons/ConnectionModal';
import { connectGroupService, connectService } from '../../services/connectionService';

type QrScanResult = string | { text: string };

const QrScanPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalIcon, setModalIcon] = useState<'spinner' | 'link'>('spinner');
  const navigate = useNavigate();
  const location = useLocation();
  const mode = location.state?.mode;
  const groupId = location.state?.groupId;

  const handleScan = async (data: QrScanResult | null) => {
    if (!data) return;

    const scanResult = typeof data === 'string' ? data : data.text;
    setShowModal(true);
    setModalMessage('노래방기계와 연결중입니다. 잠시만 기다려주세요!');
    setModalIcon('spinner');
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const { serialNumber } = JSON.parse(scanResult);
      let response;

      // 디버깅 로그 추가
      console.log('groupId:', groupId);
      console.log('serialNumber:', serialNumber);

      if (groupId) {
        console.log('Sending group connection request with payload:', {
          serialNumber,
          teamId: groupId,
        });
        response = await connectGroupService({ serialNumber, teamId: groupId });
      } else {
        console.log('Sending individual connection request with serial number:', serialNumber);
        response = await connectService(serialNumber);
      }

      console.log('Connection response:', response);

      if (response.code === 'CO100') {
        setModalMessage('연결에 성공했습니다!');
        setModalIcon('link');
        setTimeout(() => {
          setShowModal(false);
          navigate('/', {
            state: {
              isConnected: true,
              mode: mode || '그룹 모드',
              groupId: groupId,
            },
          });
        }, 2500);
      } else {
        throw new Error('Connection failed');
      }
    } catch (error) {
      console.error('Connection error:', error);
      setModalMessage('연결 중 오류가 발생했습니다. 다시 시도해주세요.');
      setModalIcon('link');
      setTimeout(() => setShowModal(false), 2500);
    }
  };

  const handleError = () => {
    setModalMessage('QR 코드 스캔 중 오류가 발생했습니다. 다시 시도해주세요.');
    setShowModal(true);
    setModalIcon('link');
  };

  return (
    <div className="flex flex-col h-screen">
      <SubTopNavbar title="QR코드 스캔" />
      <div className="flex-1 flex flex-col">
        <div className="relative w-full" style={{ height: '66.67vh' }}>
          <QrScanner
            delay={3000}
            onError={handleError}
            onScan={handleScan}
            constraints={{
              video: { facingMode: 'environment' },
            }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            // canvasProps={{ willReadFrequently: true }}
          />
        </div>
        <div className="flex-1 bg-black flex items-center justify-center p-4">
          <div className="text-center text-white text-lg font-bold">
            노래방기계에 있는 QR코드를 스캔해주세요
          </div>
        </div>
      </div>

      <ConnectionModal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
        message={modalMessage}
        icon={modalIcon}
      />
    </div>
  );
};

export default QrScanPage;
