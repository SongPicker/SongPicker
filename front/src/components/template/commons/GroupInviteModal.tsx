import React from 'react';
import BottomSlideModal from '../../template/commons/BottomSlideModal';
import CustomModal from '../../organisms/commons/CustomModal';

interface TeamMember {
  id: string;
  name: string;
  image: string;
}

interface GroupInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
  teamImage: string;
  memberCount: number;
  teamMembers: TeamMember[];
}

const GroupInviteModal: React.FC<GroupInviteModalProps> = ({
  isOpen,
  onClose,
  teamName,
  teamImage,
  memberCount,
  teamMembers,
}) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);

  const handleClose = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmClose = () => {
    setIsConfirmModalOpen(false);
    onClose();
  };

  const handleConfirmModalClose = () => {
    setIsConfirmModalOpen(false);
  };

  return (
    <>
      <BottomSlideModal isOpen={isOpen} onClose={handleClose} title="그룹 초대" height="auto">
        <div className="p-4">
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-bold mb-2">{teamName}</h2>
            <img src={teamImage} alt={teamName} className="w-1/3 rounded-md mb-4" />
          </div>
          <p className="text-gray-400 m-1">그룹 멤버 ({memberCount}/6) : </p>
          <div className="flex justify-center mb-4">
            {teamMembers.slice(0, 5).map((member, index) => (
              <div key={member.id} className="flex flex-col items-center mx-2">
                <img src={member.image} alt={member.name} className="w-10 h-10 rounded-full" />
                <span className="text-xs mt-1">{member.name}</span>
              </div>
            ))}
            {memberCount > 5 && (
              <div className="flex flex-col items-center mx-2">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-xs">+{memberCount - 5}</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center space-x-4 w-full">
            <button className="flex-1 bg-primary font-bold text-white py-2 rounded-lg">
              수락하기
            </button>
            <button
              className="flex-1 bg-accent font-bold text-white py-2 rounded-lg"
              onClick={onClose}
            >
              거절하기
            </button>
          </div>
        </div>
      </BottomSlideModal>
      <CustomModal
        isOpen={isConfirmModalOpen}
        onClose={handleConfirmModalClose}
        message="나중에 확인하시겠습니까?"
        leftButtonText="예"
        rightButtonText="아니요"
        onLeftClick={handleConfirmClose}
      />
    </>
  );
};

export default GroupInviteModal;
