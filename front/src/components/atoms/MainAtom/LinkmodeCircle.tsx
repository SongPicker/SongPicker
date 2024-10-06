import React from 'react';

interface LinkmodeCircleProps {
  isConnected: boolean;
  onClick: () => void; // 추가된 prop
}

const LinkmodeCircle = ({ isConnected, onClick }: LinkmodeCircleProps) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer text-sm font-semibold text-center size-[82px] rounded-full flex flex-col items-center justify-center ${
        isConnected ? 'border-[#50FFB3] border-[3px]' : 'border-[2px]'
      }`}
    >
      <p>{isConnected ? '반주기' : 'QR코드로'}</p>
      <p>{isConnected ? '연결중' : '연결하기'}</p>
    </div>
  );
};

export default LinkmodeCircle;
