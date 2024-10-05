import React from 'react';
import { reserveSong } from '../../../services/songService';

type Props = {
  number: string;
  onShowConnectionModal: (
    message: string,
    icon: 'link' | 'spinner' | 'reservation',
    autoCloseDelay?: number
  ) => void;
  isConnected: boolean;
};

function ReservationButton({ number, onShowConnectionModal, isConnected }: Props) {
  const handleClick = async () => {
    if (!isConnected) {
      onShowConnectionModal('노래방과 연결을 먼저 해주세요!', 'link');
      return;
    }

    try {
      onShowConnectionModal('예약 중...', 'spinner');
      const response = await reserveSong(Number(number));
      if (response.code === 'CO101') {
        onShowConnectionModal('예약 완료!', 'reservation', 2000);
      } else {
        throw new Error('예약 실패');
      }
    } catch (error) {
      console.error('예약 중 오류 발생:', error);
      onShowConnectionModal('예약 중 오류가 발생했습니다.', 'reservation', 2000);
    }
  };

  return (
    <div
      className={`flex justify-center items-center  min-w-12 px-2 py-1.5 rounded-sm text-sm font-medium ${
        isConnected ? 'bg-[#9747FF] cursor-pointer' : 'bg-gray-700 cursor-not-allowed'
      }`}
      onClick={handleClick}
    >
      예약
    </div>
  );
}

export default ReservationButton;
