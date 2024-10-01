import React from 'react';
import { MdOutlineAddCircleOutline } from 'react-icons/md';

interface Member {
  profileImage: string | null;
  nickname: string;
}

interface GroupMembersProps {
  members: Member[];
}

const GroupMembers = ({ members }: GroupMembersProps) => {
  return (
    <div className="overflow-x-auto whitespace-nowrap py-4 px-4">
      <div className="inline-flex space-x-6">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mb-2">
            <MdOutlineAddCircleOutline size={40} color="white" />
          </div>
          <span className="text-xs text-center">멤버 추가</span>
        </div>
        {members.map((member, index) => (
          <div key={index} className="flex flex-col items-center ">
            <div className="w-10 h-10 rounded-full mb-2 overflow-hidden">
              <img
                src={member.profileImage || '/src/assets/exampleImg.png'}
                alt={member.nickname}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs text-center">{member.nickname}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupMembers;
