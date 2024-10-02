import React, { useState, useCallback, useEffect } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import CreateGroupModal from '../../organisms/group/CreateGroupModal';
import GroupListContent from '../../organisms/group/GroupListContent';
import { getGroupList } from '../../../services/groupService';

interface Group {
  teamId: number;
  teamImage: string | null;
  teamName: string;
  teamMemberCount: number;
}

const GroupList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);

  const fetchGroups = useCallback(async () => {
    try {
      const response = await getGroupList();
      if (response.code === 'TE103') {
        setGroups(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleGroupCreated = useCallback(async () => {
    await fetchGroups();
    setIsModalOpen(false);
  }, [fetchGroups]);

  const handleGroupEdited = useCallback((updatedGroup: Group) => {
    setGroups(prevGroups =>
      prevGroups.map(group => (group.teamId === updatedGroup.teamId ? updatedGroup : group))
    );
  }, []);

  // 그룹 나가기 시 그룹을 제거하는 함수
  const handleGroupLeft = useCallback((teamId: number) => {
    setGroups(prevGroups => prevGroups.filter(group => group.teamId !== teamId));
  }, []);

  const fixedContent = (
    <div className="flex p-4 bg-black justify-end">
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-1/3 bg-primary text-sm text-white py-2 rounded-md hover:bg-primary transition-colors"
      >
        새 그룹 만들기
      </button>
    </div>
  );

  return (
    <MainLayout title="그룹" fixedContent={fixedContent}>
      <div className="pb-16">
        {/* GroupListContent에 onGroupLeft 전달 */}
        <GroupListContent
          groups={groups}
          onGroupEdited={handleGroupEdited}
          onGroupLeft={handleGroupLeft}
        />
      </div>
      <CreateGroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGroupCreated={handleGroupCreated}
      />
    </MainLayout>
  );
};

export default GroupList;
