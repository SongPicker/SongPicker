import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import SubLayout from '../../../layouts/SubLayout';
import { getGroupDetail, leaveGroup } from '../../../services/groupService';
import { IoSettingsOutline } from 'react-icons/io5';
import GroupMembers from '../../organisms/group/GroupMembers';
import GroupSongs from '../../organisms/group/GroupSongs';
import MemberAddModal from '../../organisms/group/MemberAddModal';
import GroupSettingsModal from '../../organisms/group/GroupSettingsModal';
import EditGroupModal from '../../organisms/group/EditGroupModal';
import CustomModal from '../../organisms/commons/CustomModal';

interface Group {
  teamId: number;
  teamImage: string | null;
  teamName: string;
  teamMemberCount: number;
  members?: Array<{ profileImage: string | null; nickname: string }>;
}
interface GroupConnect {
  isConnected: boolean;
  onShowConnectionModal: (
    message: string,
    icon: 'link' | 'spinner' | 'reservation',
    delay?: number
  ) => void;
}

const GroupDetail = ({ isConnected, onShowConnectionModal  }: GroupConnect) => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [groupDetail, setGroupDetail] = useState<Group | null>(null);
  const [isMemberAddModalOpen, setIsMemberAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);

  useEffect(() => {
    const fetchGroupDetail = async () => {
      try {
        const response = await getGroupDetail(Number(teamId));
        if (response.code === 'TE104') {
          const groupData: Group = {
            teamId: Number(teamId),
            ...response.data,
            teamMemberCount: response.data.teamMemberCnt,
            members: response.data.members || [],
          };
          setGroupDetail(groupData);
        }
      } catch (error) {
        console.error('Failed to fetch group details:', error);
      }
    };

    fetchGroupDetail();

    // URL에서 newGroup 파라미터 확인
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('newGroup') === 'true') {
      setShowNewGroupModal(true);
      // 파라미터 제거
      searchParams.delete('newGroup');
      navigate(location.pathname, { replace: true });
    }
  }, [teamId, location, navigate]);

  const handleAddMemberClick = () => {
    setIsMemberAddModalOpen(true);
  };

  const handleCloseMemberAddModal = () => {
    setIsMemberAddModalOpen(false);
  };

  const handleOpenSettingsModal = () => {
    setIsSettingsModalOpen(true);
  };

  const handleCloseSettingsModal = () => {
    setIsSettingsModalOpen(false);
  };

  const handleEditGroup = () => {
    setIsSettingsModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleLeaveGroup = () => {
    setIsSettingsModalOpen(false);
    setIsLeaveModalOpen(true);
  };

  const handleGroupEdited = async (updatedGroup: Group) => {
    setGroupDetail(prevGroup => ({
      ...updatedGroup,
      members: prevGroup?.members || [],
    }));
    setIsEditModalOpen(false);
  };

  const handleLeaveConfirm = async () => {
    if (groupDetail) {
      try {
        const response = await leaveGroup(groupDetail.teamId);
        if (response.code === 'TE102') {
          console.log('그룹 나가기 성공');
          navigate('/group'); // 그룹 목록 페이지로 이동
        } else {
          console.error('그룹 나가기 실패:', response.message);
        }
      } catch (error) {
        console.error('그룹 나가기 오류:', error);
      } finally {
        setIsLeaveModalOpen(false);
      }
    }
  };

  const handleNewGroupModalClose = () => {
    setShowNewGroupModal(false);
  };

  const handleAddMemberFromModal = () => {
    setShowNewGroupModal(false);
    setIsMemberAddModalOpen(true);
  };

  const customTitle = groupDetail ? (
    <div className="flex items-center justify-between w-full px-4">
      <div className="w-8"></div>
      <div className="flex items-center">
        <img
          src={groupDetail.teamImage || '/basicImg.png'}
          alt={groupDetail.teamName}
          className="w-6 h-6 rounded-full mr-2"
        />
        <span className="font-bold">{groupDetail.teamName}</span>
        <span className="ml-2 text-sm text-gray-400">({groupDetail.teamMemberCount}/6)</span>
      </div>
      <button
        className="w-8 h-8 flex items-center justify-center"
        onClick={handleOpenSettingsModal}
      >
        <IoSettingsOutline size={24} />
      </button>
    </div>
  ) : (
    'Loading...'
  );
  const newGroupMessage = (
    <>
      그룹이 생성되었습니다!
      <br />
      멤버를 추가해 보세요!
    </>
  );

  return (
    <SubLayout title={customTitle} disableScroll>
      <div className="flex flex-col h-full">
        {groupDetail && groupDetail.members && (
          <GroupMembers members={groupDetail.members} onAddMemberClick={handleAddMemberClick} />
        )}
        {groupDetail && (
          <GroupSongs
            teamId={groupDetail.teamId}
            teamName={groupDetail.teamName}
            isConnected={isConnected}
            onShowConnectionModal={onShowConnectionModal}
          />
        )}
      </div>

      {groupDetail && (
        <>
          <MemberAddModal
            isOpen={isMemberAddModalOpen}
            onClose={handleCloseMemberAddModal}
            teamId={groupDetail.teamId}
            onMembersInvited={() => console.log('멤버 초대 완료')}
          />

          <GroupSettingsModal
            isOpen={isSettingsModalOpen}
            onClose={handleCloseSettingsModal}
            onEditGroup={handleEditGroup}
            onLeaveGroup={handleLeaveGroup}
          />

          <EditGroupModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            group={groupDetail}
            onGroupEdited={handleGroupEdited}
          />

          <CustomModal
            isOpen={isLeaveModalOpen}
            onClose={() => setIsLeaveModalOpen(false)}
            message="그룹을 나가시겠습니까?"
            leftButtonText="나가기"
            rightButtonText="취소"
            onLeftClick={handleLeaveConfirm}
          />

          <CustomModal
            isOpen={showNewGroupModal}
            onClose={handleNewGroupModalClose}
            message={newGroupMessage}
            leftButtonText="멤버 추가"
            rightButtonText="나중에 하기"
            onLeftClick={handleAddMemberFromModal}
          />
        </>
      )}
    </SubLayout>
  );
};

export default GroupDetail;
