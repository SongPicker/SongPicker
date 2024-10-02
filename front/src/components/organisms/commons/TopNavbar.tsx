import React, { useState } from 'react';
import TopNavbarLeftList from '../../molecules/commons/TopNavbarLeftList';
import TopNavbarRightList from '../../molecules/commons/TopNavbarRightList';
import PlayListModal from '../../template/commons/PlayListModal';

type Props = {
  title?: string;
  onAlarmClick: () => void;
  onGroupInvite: () => void;
};

const TopNavbar = ({ title, onAlarmClick, onGroupInvite }: Props) => {
  const [isPlayListModalOpen, setIsPlayListModalOpen] = useState(false);

  const togglePlayListModal = () => {
    setIsPlayListModalOpen(prev => !prev);
  };

  return (
    <nav className="sticky w-screen max-w-[640px] mx-auto top-0 left-0 h-[60px] bg-black flex items-center px-4 py-2 justify-between z-[999] border-b border-[#222]">
      <TopNavbarLeftList title={title} />
      <TopNavbarRightList
        onPlayListClick={togglePlayListModal}
        onAlarmClick={onAlarmClick}
        onGroupInvite={onGroupInvite}
      />
      {isPlayListModalOpen && <PlayListModal closeModal={togglePlayListModal} />}
    </nav>
  );
};

export default TopNavbar;
