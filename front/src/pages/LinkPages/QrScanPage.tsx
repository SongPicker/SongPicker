import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import QrScanner from 'react-qr-scanner';
import SubTopNavbar from '../../components/molecules/commons/SubTopNavbar';
import ConnectionModal from '../../components/template/commons/ConnectionModal';
import {
  checkConnectionStatus,
  connectGroupService,
  connectService,
} from '../../services/connection';
import axios from 'axios';

type QrScanResult = string | { text: string };

const QrScanPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalIcon, setModalIcon] = useState<'spinner' | 'link'>('spinner');
  const navigate = useNavigate();
  const { state } = useLocation();
  const mode = state?.mode;
  const groupId = state?.groupId;

  const handleScan = async (data: QrScanResult | null) => {
    if (!data) return;

    const scanResult = typeof data === 'string' ? data : data.text;
    setShowModal(true);
    setModalMessage('노래방기계와 연결중입니다. 잠시만 기다려주세요!');
    setModalIcon('spinner');

    try {
      const { serialNumber } = JSON.parse(scanResult);
      // const response = await connectService(serialNumber);
      let response;

      if (groupId) {
        response = await connectGroupService({ serialNumber, groupId });
      } else {
        response = await connectService(serialNumber);
      }

      // 요청한 콘솔 로그만 남김
      console.log('Connection response:', response);

      if (response.code === 'CO100') {
        setModalMessage('연결에 성공했습니다!');
        setModalIcon('link');
        setTimeout(async () => {
          setShowModal(false);

          // 연결 성공 후 연결 상태 강제 업데이트
          try {
            const updatedStatus = await checkConnectionStatus();
            console.log('Updated connection status:', updatedStatus);
          } catch (error) {
            console.error('Failed to fetch updated connection status:', error);
          }

          // navigate로 메인 페이지로 이동
          navigate('/', { state: { isConnected: true, mode: mode || '그룹 모드' } });
        }, 1500);
      } else {
        throw new Error('Connection failed');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setModalMessage('이미 연결된 기기입니다. 메인 화면으로 이동합니다.');
        setModalIcon('link');
        setTimeout(() => {
          setShowModal(false);
          navigate('/');
        }, 2000);
      } else {
        setModalMessage('연결 중 오류가 발생했습니다. 다시 시도해주세요.');
        setModalIcon('link');
        setTimeout(() => setShowModal(false), 1500);
      }
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
            delay={300}
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
