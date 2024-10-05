import React, { ReactNode, useState, useRef } from 'react';
import TopNavbar from '../components/organisms/commons/TopNavbar';
import BottomNavbar from '../components/organisms/commons/BottomNavbar';
import AlarmModal from '../components/template/commons/AlarmModal';
import GroupInviteModal from '../components/template/commons/GroupInviteModal';
import { useNotificationStore } from '../stores/useNotificationStore';

type MainLayoutProps = {
  children: ReactNode;
  title?: string;
  fixedContent?: ReactNode;
};

const MainLayout = ({ children, title, fixedContent }: MainLayoutProps) => {
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  const [isGroupInviteModalOpen, setIsGroupInviteModalOpen] = useState(false);
  const currentNotificationId = useNotificationStore(state => state.currentNotificationId);
  const bellIconRef = useRef<HTMLDivElement>(null);

  const toggleAlarmModal = () => setIsAlarmModalOpen(prev => !prev);
  const toggleGroupInviteModal = () => setIsGroupInviteModalOpen(prev => !prev);

  return (
    <div className="flex flex-col w-full max-w-[640px] h-screen bg-black text-white">
      <div className="flex-shrink-0 w-full">
        <TopNavbar
          title={title}
          onAlarmClick={toggleAlarmModal}
          onGroupInvite={toggleGroupInviteModal}
          bellIconRef={bellIconRef}
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
        bellIconRef={bellIconRef}
      />
      {currentNotificationId && (
        <GroupInviteModal
          isOpen={isGroupInviteModalOpen}
          onClose={toggleGroupInviteModal}
          notificationId={currentNotificationId}
        />
      )}
    </div>
  );
};

export default MainLayout;
