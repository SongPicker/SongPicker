import React, { useState, useEffect } from 'react';
import BottomSlideModal from '../../template/commons/BottomSlideModal';
import CustomModal from '../../organisms/commons/CustomModal';
import { alarmService } from '../../../services/alarmService';
import { useNotificationStore } from '../../../stores/useNotificationStore';

interface TeamMember {
  profileImage: string | null;
  nickname: string;
}

interface GroupInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  notificationId: number;
}

const GroupInviteModal: React.FC<GroupInviteModalProps> = ({ isOpen, onClose, notificationId }) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalMessage, setConfirmModalMessage] = useState('');
  const [teamData, setTeamData] = useState<{
    teamName: string;
    teamImage: string;
    teamMemberCnt: number;
    members: TeamMember[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { deleteNotification } = useNotificationStore();
  const [inviteAction, setInviteAction] = useState<boolean | null>(null);

  useEffect(() => {
    if (isOpen && notificationId) {
      fetchTeamData();
    }
  }, [isOpen, notificationId]);

  const fetchTeamData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await alarmService.getNotificationDetail(notificationId, 'TEAM_INVITE');
      if (response.code === 'NO104' && response.data) {
        setTeamData(response.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Failed to fetch team data:', error);
      setError('팀 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteResponse = (accept: boolean) => {
    setInviteAction(accept);
    setConfirmModalMessage(
      accept ? '그룹 초대를 수락하시겠습니까?' : '그룹 초대를 거절하시겠습니까?'
    );
    setIsConfirmModalOpen(true);
  };

  const handleConfirmResponse = async () => {
    if (inviteAction === null) return;

    try {
      const response = await alarmService.respondToGroupInvite(notificationId, inviteAction);
      if (response.code === 'NO100') {
        deleteNotification(notificationId);
        onClose();
        // TODO: 사용자에게 성공 메시지 표시
      } else {
        throw new Error('Unexpected response');
      }
    } catch (error) {
      console.error('Failed to respond to group invite:', error);
      setError('초대 응답에 실패했습니다. 다시 시도해주세요.');
    }
    setIsConfirmModalOpen(false);
  };

  const handleClose = () => {
    setIsConfirmModalOpen(true);
    setConfirmModalMessage('나중에 확인하시겠습니까?');
  };

  const handleConfirmClose = () => {
    setIsConfirmModalOpen(false);
    onClose();
  };

  const handleConfirmModalClose = () => {
    setIsConfirmModalOpen(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !teamData) {
    return <div>{error || '팀 정보를 불러올 수 없습니다.'}</div>;
  }

  return (
    <>
      <BottomSlideModal isOpen={isOpen} onClose={handleClose} title="그룹 초대" height="auto">
        <div className="p-4">
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-bold mb-2">{teamData.teamName}</h2>
            <div className="w-1/3 bg-[#CDA7FF] aspect-square object-cover rounded-md">
              <img
                src={teamData.teamImage || '/basicImg.png'}
                alt={teamData.teamName}
                className="aspect-square object-cover rounded-md"
              />
            </div>
          </div>
          <p className="text-gray-400 m-1">그룹 멤버 ({teamData.teamMemberCnt}/6) : </p>
          <div className="flex justify-center mb-4">
            {teamData.members.slice(0, 5).map((member, index) => (
              <div key={index} className="flex flex-col items-center mx-2">
                <img
                  src={member.profileImage || '/basicImg.png'}
                  alt={member.nickname}
                  className="w-10 h-10 rounded-full"
                />
                <span className="text-xs mt-1">{member.nickname}</span>
              </div>
            ))}
            {teamData.teamMemberCnt > 5 && (
              <div className="flex flex-col items-center mx-2">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-xs">+{teamData.teamMemberCnt - 5}</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center space-x-4 w-full">
            <button
              className="flex-1 bg-primary font-bold text-white py-2 rounded-lg"
              onClick={() => handleInviteResponse(true)}
            >
              수락하기
            </button>
            <button
              className="flex-1 bg-accent font-bold text-white py-2 rounded-lg"
              onClick={() => handleInviteResponse(false)}
            >
              거절하기
            </button>
          </div>
        </div>
      </BottomSlideModal>
      <CustomModal
        isOpen={isConfirmModalOpen}
        onClose={handleConfirmModalClose}
        message={confirmModalMessage}
        leftButtonText="예"
        rightButtonText="아니요"
        onLeftClick={
          confirmModalMessage === '나중에 확인하시겠습니까?'
            ? handleConfirmClose
            : handleConfirmResponse
        }
      />
    </>
  );
};

export default GroupInviteModal;
