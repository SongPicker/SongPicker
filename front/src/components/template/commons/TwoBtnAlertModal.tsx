import React, { useEffect } from 'react';
import { MdLinkOff } from 'react-icons/md';

interface TwoBtnAlertModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const TwoBtnAlertModal = ({ isVisible, onClose, onConfirm, message }: TwoBtnAlertModalProps) => {
  useEffect(() => {}, [isVisible]);

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[999] max-w-[640px] mx-auto">
      <div className="bg-[#333] p-8 rounded-lg shadow-xl flex flex-col items-center">
        <MdLinkOff className={`text-6xl text-primary mb-6`} />
        <p className="text-xl font-semibold text-center text-white mb-4">{message}</p>

        {/* 두 개의 버튼 가로 배치 */}
        <div className="flex space-x-4">
          <button
            className="mt-4 bg-[#9747FF] text-white px-4 py-2 rounded"
            onClick={handleConfirm}
          >
            해제
          </button>
          <button className="mt-4 bg-gray-500 text-white px-4 py-2 rounded" onClick={handleClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwoBtnAlertModal;
