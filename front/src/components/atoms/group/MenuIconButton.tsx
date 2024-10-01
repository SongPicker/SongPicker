import React from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';

interface MenuIconButtonProps {
  onClick: (e: React.MouseEvent) => void;
}

const MenuIconButton = ({ onClick }: MenuIconButtonProps) => (
  <button className="p-1 rounded-full hover:bg-gray-700 transition-colors" onClick={onClick}>
    <BsThreeDotsVertical className="text-gray-200" />
  </button>
);

export default MenuIconButton;
