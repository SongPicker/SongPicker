import React, { ReactNode } from 'react';
import BackButton from '../../atoms/commons/BackButton';

type SubTopNavbarProps = {
  title: string | ReactNode;
  onBackButtonClick?: () => void;
};

const SubTopNavbar = ({ title, onBackButtonClick }: SubTopNavbarProps) => {
  return (
    <nav className="sticky w-screen max-w-[640px] mx-auto top-0 left-0 h-[60px] bg-black flex items-center px-4 py-2 z-[999] border-b border-[#222]">
      <div className="absolute bottom-3 left-4">
        <BackButton onClick={onBackButtonClick} />
      </div>
      <h1 className="text-white text-lg font-bold w-full text-center">{title}</h1>
    </nav>
  );
};

export default SubTopNavbar;
