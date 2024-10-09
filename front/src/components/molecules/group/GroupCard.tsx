import React from 'react';
import GroupImage from '../../atoms/group/GroupImage';
import GroupName from '../../atoms/group/GroupName';
import GroupMemberCount from '../../atoms/group/GroupMemberCount';
import MenuIconButton from '../../atoms/group/MenuIconButton';
import GroupMenu from './GroupMenu';

interface GroupCardProps {
  teamId: number;
  teamImage: string | null;
  teamName: string;
  teamMemberCount: number;
  openMenuId: number | null;
  onMenuToggle: (e: React.MouseEvent | null, teamId: number) => void;
  onGroupClick: (e: React.MouseEvent) => void;
  onAddMemberClick: (e: React.MouseEvent) => void;
  onEditClick: (e: React.MouseEvent) => void;
  onGroupLeft: (teamId: number) => void;
  isOpen: boolean;
  isSelected: boolean;
  showMenu: boolean;
}

const GroupCard = ({
  teamId,
  teamImage,
  teamName,
  teamMemberCount,
  openMenuId,
  onMenuToggle,
  onGroupClick,
  onAddMemberClick,
  onEditClick,
  onGroupLeft,
  isOpen,
  isSelected,
  showMenu,
}: GroupCardProps) => (
  <div
    className={`rounded-lg p-3 cursor-pointer relative flex flex-col justify-between ${
      isSelected ? 'bg-[#9747FF]' : 'bg-gray-800'
    }`}
    onClick={e => {
      if (!isOpen) {
        onGroupClick(e); // 클릭 이벤트 객체를 전달하도록 수정
      }
    }}
  >
    {showMenu && ( // 메뉴 버튼과 메뉴를 조건부 렌더링
      <div className="absolute top-2 right-2">
        <MenuIconButton onClick={e => onMenuToggle(e, teamId)} />
        {isOpen && openMenuId === teamId && (
          <GroupMenu
            teamId={teamId}
            onClose={() => onMenuToggle(null, teamId)}
            onAddMemberClick={e => {
              e.stopPropagation();
              onAddMemberClick(e);
            }}
            onEditClick={e => {
              e.stopPropagation();
              onEditClick(e);
            }}
            onGroupLeft={() => {
              onGroupLeft(teamId);
            }}
          />
        )}
      </div>
    )}
    <div className="flex flex-col flex-grow">
      <div className="flex justify-center w-full h-full">
        <GroupImage src={teamImage} alt={teamName} />
      </div>
      <GroupName name={teamName} />
      <GroupMemberCount count={teamMemberCount} />
    </div>
  </div>
);

export default GroupCard;
