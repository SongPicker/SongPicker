import React, { useEffect, useState, useCallback } from 'react';
import { HiBellAlert } from 'react-icons/hi2';
import { alarmService } from '../../../services/alarmService';

type Props = {
  onClick: () => void;
  onGroupInvite: () => void;
};

const BellAlertIcon: React.FC<Props> = React.memo(({ onClick, onGroupInvite }) => {
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  const checkUnreadNotifications = useCallback(async () => {
    try {
      const response = await alarmService.checkUnreadNotifications();
      console.log('Unread notifications response:', response); // 디버깅용
      if (response.code === 'NO105') {
        setHasUnreadNotifications(response.data);
      }
    } catch (error) {
      console.error('Failed to check unread notifications:', error);
    }
  }, []);

  useEffect(() => {
    checkUnreadNotifications();
    const intervalId = setInterval(checkUnreadNotifications, 60000); // 1분마다 체크
    return () => clearInterval(intervalId);
  }, [checkUnreadNotifications]);

  return (
    <div className="relative inline-block">
      <HiBellAlert className="h-[24px] w-auto text-white me-6 cursor-pointer" onClick={onClick} />
      {hasUnreadNotifications && (
        <div className="absolute top-0 right-6 h-2 w-2 bg-red-500 rounded-full z-10" />
      )}
    </div>
  );
});

export default BellAlertIcon;
