import React, { useState } from 'react';

interface MemberAddFormProps {
  inputValue: string;
  selectedMembers: string[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddMember: () => void;
  onRemoveMember: (member: string) => void;
  onSubmit: () => void;
}

const MemberAddForm = ({
  inputValue,
  selectedMembers,
  onInputChange,
  onAddMember,
  onRemoveMember,
  onSubmit,
}: MemberAddFormProps) => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="닉네임으로 초대하기"
          value={inputValue}
          onChange={onInputChange}
          className="flex-grow px-3 py-2 rounded-lg bg-gray-700 text-white"
        />
        <button
          onClick={onAddMember}
          className="ml-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          초대
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {selectedMembers.map(member => (
          <div
            key={member}
            className="flex items-center px-3 py-2 bg-gray-800 text-white rounded-full"
          >
            {member}
            <button
              onClick={() => onRemoveMember(member)}
              className="ml-2 text-gray-400 hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={onSubmit}
        className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
      >
        추가 완료
      </button>
    </div>
  );
};

export default MemberAddForm;
