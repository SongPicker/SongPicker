import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import FooterButtonLayout from '../../layouts/FooterButtonLayout';
import GroupListContent from '../../components/organisms/group/GroupListContent';
import { getGroupList } from '../../services/groupService';

interface Group {
  teamId: number;
  teamImage: string | null;
  teamName: string;
  teamMemberCount: number;
}

const GroupSelectPage = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const navigate = useNavigate();

  // 그룹 목록을 불러오는 함수
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
    fetchGroups(); // 컴포넌트가 마운트될 때 그룹 목록을 불러옵니다.
  }, [fetchGroups]);

  const handleGroupSelect = (event: React.MouseEvent, groupId: number) => {
    event.stopPropagation(); // 기본 동작 막기
    setSelectedGroup(groupId); // 그룹 선택 상태 업데이트
  };

  const handleNext = () => {
    if (selectedGroup) {
      navigate('/qr-scan', { state: { groupId: selectedGroup } });
    }
  };

  return (
    <FooterButtonLayout
      title="노래방 그룹 선택"
      buttonText="QR스캔"
      onButtonClick={handleNext}
      isButtonValid={selectedGroup !== null}
    >
      <div className="flex-1">
        <GroupListContent
          groups={groups}
          onGroupEdited={updatedGroup => {
            setGroups(prevGroups =>
              prevGroups.map(group => (group.teamId === updatedGroup.teamId ? updatedGroup : group))
            );
          }}
          onGroupLeft={teamId => {
            setGroups(prevGroups => prevGroups.filter(group => group.teamId !== teamId));
          }}
          onGroupClick={handleGroupSelect} // 그룹 클릭 시 선택하도록 핸들러 추가
        />
      </div>
    </FooterButtonLayout>
  );
};

export default GroupSelectPage;
