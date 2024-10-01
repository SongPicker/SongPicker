import React from 'react';

interface GroupNameProps {
  name: string;
}

const GroupName = ({ name }: GroupNameProps) => (
  <h2 className="text-lg font-semibold text-white">{name}</h2>
);

export default GroupName;
