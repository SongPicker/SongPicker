import React from 'react';
import { HiBellAlert } from 'react-icons/hi2';

type Props = {
  onClick: () => void;
  onGroupInvite: () => void;
};

const BellAlertIcon: React.FC<Props> = ({ onClick, onGroupInvite }) => {
  return (
    <HiBellAlert className="h-[24px] w-auto text-white me-6 cursor-pointer" onClick={onClick} />
  );
};

export default BellAlertIcon;
