import React, { ReactNode, useState } from 'react';
import TopNavbar from '../components/organisms/commons/TopNavbar';
import BottomNavbar from '../components/organisms/commons/BottomNavbar';
import AlarmModal from '../components/template/commons/AlarmModal';
import GroupInviteModal from '../components/template/commons/GroupInviteModal';

type MainLayoutProps = {
  children: ReactNode;
  title?: string;
  fixedContent?: ReactNode;
};

const MainLayout = ({ children, title, fixedContent }: MainLayoutProps) => {
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  const [isGroupInviteModalOpen, setIsGroupInviteModalOpen] = useState(false);

  const toggleAlarmModal = () => setIsAlarmModalOpen(prev => !prev);
  const toggleGroupInviteModal = () => setIsGroupInviteModalOpen(prev => !prev);

  // 더미 데이터로 팀 멤버 정보 생성
  const teamMembers = [
    { id: '1', name: '루나', image: '/basicImg.png' },
    { id: '2', name: '은지', image: '/basicImg.png' },
    { id: '3', name: '승현', image: '/basicImg.png' },
    { id: '4', name: '하페', image: '/basicImg.png' },
    { id: '5', name: '수환', image: '/basicImg.png' },
  ];

  return (
    <div className="flex flex-col w-full max-w-[640px] h-screen bg-black text-white">
      <div className="flex-shrink-0 w-full  ">
        <TopNavbar
          title={title}
          onAlarmClick={toggleAlarmModal}
          onGroupInvite={toggleGroupInviteModal}
        />
      </div>
      <div className="flex-grow flex flex-col overflow-hidden relative pb-[60px]">
        {fixedContent && (
          <div className="flex-shrink-0 bg-black z-10 sticky top-0 border-b border-primary">
            {fixedContent}
          </div>
        )}
        <div className="flex-grow overflow-y-auto overflow-x-hidden">{children}</div>
      </div>
      <BottomNavbar />
      <AlarmModal
        isOpen={isAlarmModalOpen}
        onClose={toggleAlarmModal}
        onGroupInvite={toggleGroupInviteModal}
      />
      <GroupInviteModal
        isOpen={isGroupInviteModalOpen}
        onClose={toggleGroupInviteModal}
        teamName="프로젝트 A팀"
        teamImage="/basicImg.png"
        memberCount={5}
        teamMembers={teamMembers}
      />
    </div>
  );
};

export default MainLayout;
