import React from 'react';
import { BsX } from 'react-icons/bs';

interface CloseIconButtonProps {
  onClick: (e: React.MouseEvent) => void;
}

const CloseIconButton = ({ onClick }: CloseIconButtonProps) => (
  <button className="absolute top-2 right-2 text-gray-400 hover:text-white" onClick={onClick}>
    <BsX size={20} />
  </button>
);

export default CloseIconButton;
