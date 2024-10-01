import React from 'react';
import CloseIconButton from '../../atoms/group/CloseIconButton';
import { leaveGroup } from '../../../services/groupService';

interface GroupMenuProps {
  teamId: number;
  onClose: (e: React.MouseEvent) => void;
  onAddMemberClick: (e: React.MouseEvent) => void;
  onEditClick: (e: React.MouseEvent) => void;
  onLeaveClick: (e: React.MouseEvent) => void;
  onGroupLeft: () => void;
}

const GroupMenu = ({
  teamId,
  onClose,
  onAddMemberClick,
  onEditClick,
  onLeaveClick,
  onGroupLeft,
}: GroupMenuProps) => {
  const handleLeaveClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await leaveGroup(teamId);
      if (response.code === 'TE102') {
        console.log('그룹 나가기 성공');
        onGroupLeft();
      } else {
        console.error('그룹 나가기 실패:', response.message);
      }
    } catch (error) {
      console.error('그룹 나가기 오류:', error);
    }
  };

  return (
    <div className="absolute right-0 mt-1 w-32 bg-gray-700 bg-opacity-90 rounded-md shadow-lg overflow-hidden z-10 transition-all duration-300 ease-in-out origin-top-right scale-100 opacity-100">
      <div className="relative">
        <CloseIconButton onClick={onClose} />
      </div>
      <div className="py-2">
        <button
          className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
          onClick={onAddMemberClick}
        >
          멤버 추가
        </button>
        <button
          className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
          onClick={onEditClick}
        >
          그룹 편집
        </button>
        <button
          className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
          onClick={handleLeaveClick}
        >
          그룹 나가기
        </button>
      </div>
    </div>
  );
};

export default GroupMenu;
