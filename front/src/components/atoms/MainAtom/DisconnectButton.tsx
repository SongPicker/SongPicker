import React, { useState, useCallback } from 'react';
import { MdOutlineLinkOff } from 'react-icons/md';
import TwoBtnAlertModal from '../../template/commons/TwoBtnAlertModal';
import { disconnectService } from '../../../services/connection';

interface DisconnectButtonProps {
  onDisconnect: () => void;
}

const DisconnectButton = ({ onDisconnect }: DisconnectButtonProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleDisconnectClick = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleConfirm = async () => {
    await onDisconnect();
    setIsModalVisible(false);
  };
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
