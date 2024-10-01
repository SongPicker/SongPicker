import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { checkConnectionStatus, disconnectService } from '../../../services/connection';
import TwoBtnAlertModal from '../../template/commons/TwoBtnAlertModal';

const LinkmodeCircle = ({ isConnected }: { isConnected: boolean }) => {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    if (isConnected) {
      setShowModal(true);
    } else {
      navigate('/member-select');
    }
  };

  const handleDisconnect = async () => {
    try {
      const response = await disconnectService();
      console.log('Disconnect response:', response);
      if (response.code === 'CO103') {
        setShowModal(false);
      } else {
        throw new Error('Disconnect failed');
      }
    } catch (error) {
      console.error('Failed to disconnect:', error);
    } finally {
      setShowModal(false);
    }
  };

  return (
    <>
      <div
        onClick={handleClick}
        className={`cursor-pointer text-sm font-semibold text-center size-[82px] rounded-full flex flex-col items-center justify-center ${
          isConnected ? 'border-[#50FFB3] border-[3px]' : 'border-[2px]'
        }`}
      >
        <p>{isConnected ? '반주기' : 'QR코드로'}</p>
        <p>{isConnected ? '연결중' : '연결하기'}</p>
      </div>

      {showModal && (
        <TwoBtnAlertModal
          isVisible={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={() => {
            // 연결 해제 로직을 호출하고, 상태 업데이트.
            setShowModal(false);
          }}
          message="이미 연결이 되어있습니다. 기존의 연결을 해제하시겠습니까?"
        />
      )}
    </>
  );
};

export default LinkmodeCircle;
