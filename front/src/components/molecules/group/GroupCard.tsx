import React from 'react';
import GroupImage from '../../atoms/group/GroupImage';
import GroupName from '../../atoms/group/GroupName';
import GroupMemberCount from '../../atoms/group/GroupMemberCount';
import MenuIconButton from '../../atoms/group/MenuIconButton';
import GroupMenu from './GroupMenu';

interface GroupCardProps {
  teamId: number;
  teamImage: string;
  teamName: string;
  teamMemberCount: number;
  openMenuId: number | null;
  onMenuToggle: (e: React.MouseEvent, teamId: number) => void;
  onGroupClick: () => void;
  onAddMemberClick: (e: React.MouseEvent) => void;
  onEditClick: (e: React.MouseEvent) => void;
  onLeaveClick: (teamId: number) => void;
  onGroupLeft: () => void;
  isOpen: boolean;
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
  onLeaveClick,
  onGroupLeft,
  isOpen,
}: GroupCardProps) => (
  <div
    className="bg-gray-800 rounded-lg p-3 cursor-pointer relative flex flex-col justify-between"
    onClick={onGroupClick}
  >
    <div className="absolute top-2 right-2">
      <MenuIconButton onClick={e => onMenuToggle(e, teamId)} />
      {isOpen && openMenuId === teamId && (
        <GroupMenu
          teamId={teamId}
          onClose={e => onMenuToggle(e, teamId)}
          onAddMemberClick={onAddMemberClick}
          onEditClick={onEditClick}
          onLeaveClick={() => onLeaveClick(teamId)}
          onGroupLeft={onGroupLeft}
        />
      )}
    </div>
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
