import React from 'react';
import { useNavigate } from 'react-router-dom';
import LinkmodeLeft from '../../molecules/MainMolecule/LinkmodeLeft';
import LinkmodeCircle from '../../atoms/MainAtom/LinkmodeCircle';

const KaraokeLinkMode = ({ isConnected }: { isConnected: boolean }) => {
  const navigate = useNavigate();

  const handleLinkModeCircleClick = () => {
    navigate('/member-select'); // 버튼을 클릭하면 멤버 선택 페이지로 이동
  };

  return (
    <div
      className="relative flex justify-between w-full min-w-[320px] h-[150px] ms-auto p-[3px] rounded-2xl"
      style={{ background: 'linear-gradient(to bottom, #D34ADE, #5B2B99)' }}
    >
      <div className="flex justify-between w-full h-full bg-black rounded-2xl p-4">
        <LinkmodeLeft isConnected={isConnected} />
        <div onClick={handleLinkModeCircleClick} className="self-center ms-2">
          <LinkmodeCircle isConnected={isConnected} />
        </div>
      </div>
    </div>
  );
};

export default KaraokeLinkMode;
