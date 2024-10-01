import React from 'react';

interface GroupMemberCountProps {
  count: number;
}

const GroupMemberCount = ({ count }: GroupMemberCountProps) => (
  <p className="text-sm text-gray-400">{count} / 6</p>
);

export default GroupMemberCount;
