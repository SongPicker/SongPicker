import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import GroupCard from '../../molecules/group/GroupCard';
import EditGroupModal from '../../organisms/group/EditGroupModal';
import { leaveGroup } from '../../../services/groupService';
interface Group {
  teamId: number;
  teamImage: string;
  teamName: string;
  teamMemberCount: number;
}

interface GroupListContentProps {
  groups: Group[];
  onGroupEdited: (updatedGroup: Group) => void;
}

const GroupListContent = ({ groups, onGroupEdited }: GroupListContentProps) => {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [localGroups, setLocalGroups] = useState<Group[]>(groups);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalGroups(groups);
  }, [groups]);

  const handleGroupClick = useCallback(
    (teamId: number) => {
      navigate(`/group/${teamId}`);
    },
    [navigate]
  );

  const toggleMenu = useCallback((e: React.MouseEvent, teamId: number) => {
    e.stopPropagation();
    setOpenMenuId(prevId => (prevId === teamId ? null : teamId));
  }, []);

  const closeMenu = useCallback(() => {
    setOpenMenuId(null);
  }, []);

  const handleEditClick = useCallback(
    (e: React.MouseEvent, group: Group) => {
      e.preventDefault();
      e.stopPropagation();
      setSelectedGroup(group);
      setIsEditModalOpen(true);
      closeMenu();
    },
    [closeMenu]
  );

  const handleGroupEditedInternal = useCallback(
    async (updatedGroup: Group) => {
      setLocalGroups(prevGroups =>
        prevGroups.map(group => (group.teamId === updatedGroup.teamId ? updatedGroup : group))
      );
      await onGroupEdited(updatedGroup);
      setIsEditModalOpen(false);
    },
    [onGroupEdited]
  );

  const handleLeaveGroup = useCallback(
    async (teamId: number) => {
      try {
        const response = await leaveGroup(teamId);
        if (response.code === 'TE102') {
          setLocalGroups(prevGroups => prevGroups.filter(group => group.teamId !== teamId));
          await onGroupEdited({ teamId, teamName: '', teamImage: '', teamMemberCount: 0 });
        } else {
          console.error('그룹 나가기 실패:', response.message);
        }
      } catch (error) {
        console.error('그룹 나가기 오류:', error);
      }
    },
    [onGroupEdited]
  );

  const handleGroupLeft = useCallback((teamId: number) => {
    console.log(`그룹 ${teamId}에서 나갔습니다.`);
    // 필요한 경우 여기에 추가 로직을 구현할 수 있습니다.
  }, []);

  return (
    <div className="h-full overflow-y-auto bg-black">
      <div className="grid grid-cols-2 gap-4 p-4">
        {localGroups.map(group => (
          <GroupCard
            key={group.teamId}
            teamId={group.teamId}
            teamImage={group.teamImage}
            teamName={group.teamName}
            teamMemberCount={group.teamMemberCount}
            openMenuId={openMenuId}
            onMenuToggle={toggleMenu}
            onGroupClick={() => handleGroupClick(group.teamId)}
            onAddMemberClick={() => console.log('멤버 추가 clicked')}
            onEditClick={e => handleEditClick(e, group)}
            onLeaveClick={() => handleLeaveGroup(group.teamId)}
            onGroupLeft={() => {
              console.log(`그룹 ${group.teamId}에서 나갔습니다.`);
            }}
            isOpen={openMenuId === group.teamId}
          />
        ))}
      </div>

      {selectedGroup && (
        <EditGroupModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          group={selectedGroup}
          onGroupEdited={handleGroupEditedInternal}
        />
      )}
    </div>
  );
};

export default GroupListContent;
