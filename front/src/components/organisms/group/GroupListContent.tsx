import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import GroupCard from '../../molecules/group/GroupCard';
import EditGroupModal from '../../organisms/group/EditGroupModal';
import MemberAddModal from '../../organisms/group/MemberAddModal'; // 추가

interface Group {
  teamId: number;
  teamImage: string;
  teamName: string;
  teamMemberCount: number;
}

interface GroupListContentProps {
  groups: Group[];
  onGroupEdited: (updatedGroup: Group) => void;
  onGroupLeft: (teamId: number) => void;
}

const GroupListContent = ({ groups, onGroupEdited, onGroupLeft }: GroupListContentProps) => {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMemberAddModalOpen, setIsMemberAddModalOpen] = useState(false); // 추가
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [localGroups, setLocalGroups] = useState<Group[]>(groups);

  useEffect(() => {
    setLocalGroups(groups);
  }, [groups]);

  const handleGroupClick = useCallback(
    (teamId: number) => {
      navigate(`/group/${teamId}`);
    },
    [navigate]
  );

  const toggleMenu = useCallback((e: React.MouseEvent | null, teamId: number) => {
    if (e) e.stopPropagation();
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

  const handleGroupLeftInternal = useCallback(
    (teamId: number) => {
      setLocalGroups(prevGroups => prevGroups.filter(group => group.teamId !== teamId));
      onGroupLeft(teamId);
    },
    [onGroupLeft]
  );

  const handleAddMemberClick = useCallback(
    (group: Group) => {
      setSelectedGroup(group);
      setIsMemberAddModalOpen(true);
      closeMenu();
    },
    [closeMenu]
  );

  const handleMembersInvited = useCallback(() => {
    console.log('멤버 초대 완료');
    setIsMemberAddModalOpen(false);
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
            onAddMemberClick={() => handleAddMemberClick(group)} // 멤버 추가 클릭 시 호출
            onEditClick={e => handleEditClick(e, group)}
            onGroupLeft={() => handleGroupLeftInternal(group.teamId)}
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

      {selectedGroup && (
        <MemberAddModal
          isOpen={isMemberAddModalOpen}
          onClose={() => setIsMemberAddModalOpen(false)}
          teamId={selectedGroup.teamId}
          onMembersInvited={handleMembersInvited}
        />
      )}
    </div>
  );
};

export default GroupListContent;
