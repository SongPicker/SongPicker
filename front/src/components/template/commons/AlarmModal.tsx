import React, { useState, useEffect } from 'react';
import { IoClose, IoNotificationsOutline, IoTrashOutline } from 'react-icons/io5';

interface Alarm {
  id: number;
  content: string;
  isRead: boolean;
  teamName: string;
  teamImage: string;
  memberCount: number;
}

interface AlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupInvite: (teamName: string, teamImage: string, memberCount: number) => void;
}

const AlarmModal = ({ isOpen, onClose, onGroupInvite }: AlarmModalProps) => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let timer: number;

    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      timer = window.setTimeout(() => {
        setIsAnimating(false);
        document.body.style.overflow = '';
      }, 300);
    }

    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    setAlarms([
      {
        id: 1,
        content: '초대장이 왔어요!',
        isRead: false,
        teamName: '프로젝트 A팀',
        teamImage: '/path/to/A-team-image.jpg',
        memberCount: 5,
      },
      {
        id: 2,
        content: '초대장이 왔어요!',
        isRead: true,
        teamName: '스터디 B팀',
        teamImage: '/path/to/B-team-image.jpg',
        memberCount: 3,
      },
      {
        id: 3,
        content: '초대장이 왔어요!',
        isRead: false,
        teamName: '동아리 C팀',
        teamImage: '/path/to/C-team-image.jpg',
        memberCount: 7,
      },
    ]);
  }, []);

  const handleAlarmClick = (alarm: Alarm) => {
    setAlarms(prevAlarms => prevAlarms.map(a => (a.id === alarm.id ? { ...a, isRead: true } : a)));
    onGroupInvite(alarm.teamName, alarm.teamImage, alarm.memberCount);
    onClose();
  };

  const handleDeleteAlarm = (e: React.MouseEvent, alarmId: number) => {
    e.stopPropagation();
    setAlarms(prevAlarms => prevAlarms.filter(alarm => alarm.id !== alarmId));
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div
      className={`fixed inset-0 z-50 text-sm flex justify-end items-start transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        top: '3.5rem',
      }}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-b-2xl shadow-lg transform transition-transform duration-300 ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col gap-2 p-2">
          {alarms.length === 0 ? (
            <div className="py-4 px-4 text-center text-gray-500">현재 알람이 없습니다!</div>
          ) : (
            alarms.map(alarm => (
              <React.Fragment key={alarm.id}>
                <div
                  className="flex items-center justify-between py-2 px-4 cursor-pointer"
                  onClick={() => handleAlarmClick(alarm)}
                >
                  <div className="flex items-center">
                    <IoNotificationsOutline
                      size={18}
                      className={`mr-3 ${alarm.isRead ? 'text-gray-500' : 'text-primary'}`}
                    />
                    <div>
                      <p className={`font-bold ${alarm.isRead ? 'text-gray-700' : 'text-primary'}`}>
                        {alarm.teamName}{' '}
                        {alarm.isRead && <span className="font-normal text-gray-500">(읽음)</span>}
                      </p>
                      <p className={alarm.isRead ? 'text-gray-500' : 'text-primary'}>
                        {alarm.content}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={e => handleDeleteAlarm(e, alarm.id)}
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
        <div className="flex justify-end p-2">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <IoClose size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlarmModal;
