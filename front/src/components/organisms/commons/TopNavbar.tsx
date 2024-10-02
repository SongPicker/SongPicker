import React, { useState } from 'react';
import TopNavbarLeftList from '../../molecules/commons/TopNavbarLeftList';
import TopNavbarRightList from '../../molecules/commons/TopNavbarRightList';
import PlayListModal from '../../template/commons/PlayListModal';

type Props = {
  title?: string;
};

const TopNavbar = ({ title }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(prev => !prev);
  };

  return (
    <nav className="sticky w-screen max-w-[640px] mx-auto top-0 left-0 h-[60px] bg-black flex items-center px-4 py-2 justify-between z-[999] border-b border-[#222]">
      <TopNavbarLeftList title={title} />
      <TopNavbarRightList onPlayListClick={toggleModal} />
      {isModalOpen && <PlayListModal closeModal={toggleModal} />}
    </nav>
  );
};

export default TopNavbar;
