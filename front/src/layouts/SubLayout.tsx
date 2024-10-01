import React, { ReactNode } from 'react';
import SubTopNavbar from '../components/molecules/commons/SubTopNavbar';
import BottomNavbar from '../components/organisms/commons/BottomNavbar';

type SubLayoutProps = {
  children: ReactNode;
  title: string | ReactNode;
  disableScroll?: boolean;
};

const SubLayout = ({ children, title, disableScroll = false }: SubLayoutProps) => {
  return (
    <div className="flex flex-col w-full h-screen bg-black text-white">
      <div className="flex-shrink-0">
        <SubTopNavbar title={title} />
      </div>
      <div className={`flex-grow ${disableScroll ? '' : 'overflow-y-auto'}`}>{children}</div>
      <div className="flex-shrink-0">
        <BottomNavbar />
      </div>
    </div>
  );
};

export default SubLayout;
