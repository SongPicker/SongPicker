import React, { useState, useEffect, RefObject } from 'react';
import { IoClose, IoNotificationsOutline, IoTrashOutline } from 'react-icons/io5';
import { alarmService } from '../../../services/alarmService';
import { useNotificationStore } from '../../../stores/useNotificationStore';

interface Notification {
  notificationId: number;
  isRead: boolean;
  content: string;
}

interface AlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupInvite: () => void;
  bellIconRef: RefObject<HTMLDivElement>;
}

const AlarmModal = ({ isOpen, onClose, onGroupInvite, bellIconRef }: AlarmModalProps) => {
  const {
    notifications,
    setNotifications,
    setCurrentNotificationId,
    markAsRead,
    deleteNotification,
  } = useNotificationStore();
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, right: 0 });

  useEffect(() => {
    let timer: number;

    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
      fetchAlarms();
      updateModalPosition();
    } else {
      timer = window.setTimeout(() => {
        setIsAnimating(false);
        document.body.style.overflow = '';
      }, 300);
    }

    return () => window.clearTimeout(timer);
  }, [isOpen]);

  const updateModalPosition = () => {
    if (bellIconRef.current) {
      const rect = bellIconRef.current.getBoundingClientRect();
      setModalPosition({
        top: rect.bottom,
        right: window.innerWidth - rect.right,
      });
    }
  };

  const fetchAlarms = async () => {
    try {
      const response = await alarmService.getNotifications();
      if (response.code === 'NO103' && Array.isArray(response.data)) {
        setNotifications(response.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setError('알림을 불러오는데 실패했습니다.');
    }
  };

  const handleAlarmClick = async (alarm: Notification) => {
    try {
      const response = await alarmService.readNotification(alarm.notificationId);
      if (response.code === 'NO101') {
        markAsRead(alarm.notificationId);
        setCurrentNotificationId(alarm.notificationId);
        onGroupInvite();
        onClose();
      } else {
        throw new Error(`Unexpected response: ${JSON.stringify(response)}`);
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      setError('알림을 읽음 처리하는데 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleDeleteAlarm = async (e: React.MouseEvent, alarmId: number) => {
    e.stopPropagation();
    try {
      await deleteNotification(alarmId);
    } catch (error) {
      console.error('Failed to delete notification:', error);
      setError('알림을 삭제하는데 실패했습니다.');
    }
  };

  const formatAlarmContent = (content: string, isRead: boolean) => {
    const teamNameMatch = content.match(/^(.+?)\s팀/);
    const teamName = teamNameMatch ? teamNameMatch[0] : '알 수 없는 팀';
    const remainingContent = content.replace(teamName, '').trim();

    return (
      <>
        <p className={`font-bold ${isRead ? 'text-gray-700' : 'text-primary'}`}>
          {teamName} {isRead && <span className="font-normal text-gray-500">(읽음)</span>}
        </p>
        <p className="text-gray-600 text-sm">{remainingContent}</p>
      </>
    );
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div
      className={`fixed z-[99] mr-5 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{
        top: `${modalPosition.top + 18}px`,
        right: `${modalPosition.right}px`,
      }}
      onClick={onClose}
    >
      <div
        className={`w-[270px] bg-white rounded-b-2xl shadow-lg transform transition-transform duration-300 ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col gap-2 p-2">
          {error && <div className="text-red-500 text-center">{error}</div>}
          {notifications.length === 0 ? (
            <div className="py-4 px-4 text-center text-gray-500">현재 알람이 없습니다!</div>
          ) : (
            notifications.map(alarm => (
              <React.Fragment key={alarm.notificationId}>
                <div
                  className="flex items-start justify-between py-2 px-4 cursor-pointer"
                  onClick={() => handleAlarmClick(alarm)}
                >
                  <div className="flex items-start">
                    <IoNotificationsOutline
                      size={18}
                      className={`mr-3 mt-2 ${alarm.isRead ? 'text-gray-500' : 'text-primary'}`}
                    />
                    <div>{formatAlarmContent(alarm.content, alarm.isRead)}</div>
                  </div>
                  <button
                    onClick={e => handleDeleteAlarm(e, alarm.notificationId)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <IoTrashOutline size={18} />
                  </button>
                </div>
                <hr className="my-1" />
              </React.Fragment>
            ))
          )}
        </div>
        <div className="flex justify-end p-2 mx-3">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <IoClose size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlarmModal;
