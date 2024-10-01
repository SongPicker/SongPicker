import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SubLayout from '../../../layouts/SubLayout';
import { getGroupDetail } from '../../../services/groupService';
import { IoSettingsOutline } from 'react-icons/io5';
import GroupMembers from '../../organisms/group/GroupMembers';
import GroupSongs from '../../organisms/group/GroupSongs';

interface GroupDetailData {
  teamImage: string;
  teamName: string;
  teamMemberCnt: number;
  members: Array<{ profileImage: string | null; nickname: string }>;
}

const GroupDetail: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [groupDetail, setGroupDetail] = useState<GroupDetailData | null>(null);

  useEffect(() => {
    const fetchGroupDetail = async () => {
      try {
        const response = await getGroupDetail(Number(teamId));
        if (response.code === 'TE104') {
          // 더미 데이터 추가
          const dummyMembers = [
            { profileImage: null, nickname: '낑깡' },
            { profileImage: null, nickname: '멤버2' },
            { profileImage: null, nickname: '멤버3' },
            { profileImage: null, nickname: '멤버4' },
            { profileImage: null, nickname: '멤버5' },
            { profileImage: null, nickname: '멤버6' },
          ];
          setGroupDetail({
            ...response.data,
            teamMemberCnt: 6,
            members: dummyMembers,
          });
        }
      } catch (error) {
        console.error('Failed to fetch group details:', error);
      }
    };

    fetchGroupDetail();
  }, [teamId]);

  const customTitle = groupDetail ? (
    <div className="flex items-center justify-between w-full px-4">
      <div className="w-8"></div>
      <div className="flex items-center">
        <img
          src={groupDetail.teamImage}
          alt={groupDetail.teamName}
          className="w-6 h-6 rounded-full mr-2"
        />
        <span className="font-bold">{groupDetail.teamName}</span>
        <span className="ml-2 text-sm text-gray-400">({groupDetail.teamMemberCnt}/6)</span>
      </div>
      <button
        className="w-8 h-8 flex items-center justify-center"
        onClick={() => console.log('Settings clicked')}
      >
        <IoSettingsOutline size={24} />
      </button>
    </div>
  ) : (
    'Loading...'
  );

  return (
    <SubLayout title={customTitle} disableScroll>
      <div className="flex flex-col h-full">
        {groupDetail && <GroupMembers members={groupDetail.members} />}
        <GroupSongs />
      </div>
    </SubLayout>
  );
};

export default GroupDetail;
