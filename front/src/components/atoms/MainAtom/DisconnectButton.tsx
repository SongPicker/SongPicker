import React, { useState, useCallback } from 'react';
import { MdOutlineLinkOff } from 'react-icons/md';
import TwoBtnAlertModal from '../../template/commons/TwoBtnAlertModal';
import { disconnectService } from '../../../services/connection';

const DisconnectButton = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 연결 해제 버튼 클릭 시 모달을 띄우는 함수
  const handleDisconnectClick = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  // 모달 닫기 함수
  const handleCloseModal = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  // 연결 해제 확인 함수
  const handleConfirm = useCallback(async () => {
    try {
      // 연결 해제 API 호출
      const response = await disconnectService();
      console.log('Disconnect response:', response);

      if (response.code === 'CO103') {
        console.log('연결이 해제되었습니다.');
        // 연결 해제 후 필요한 UI 업데이트
        setIsModalVisible(false);
      } else {
        throw new Error('Disconnect failed');
      }
    } catch (error) {
      console.error('Failed to disconnect:', error);
      // TODO: 사용자에게 오류 메시지 표시
    }
  }, []);
  return (
    <>
      <div className="flex items-center" onClick={handleDisconnectClick}>
        <MdOutlineLinkOff className="text-red-400" />
        <div className="text-red-400 text-sm ms-2">연결해제</div>
      </div>

      {isModalVisible && (
        <TwoBtnAlertModal
          isVisible={isModalVisible}
          onClose={handleCloseModal}
          onConfirm={handleConfirm}
          message="정말 연결을 해제하시겠습니까?"
        />
      )}
    </>
  );
};

export default DisconnectButton;
