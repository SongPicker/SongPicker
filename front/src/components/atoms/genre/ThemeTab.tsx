import React from 'react';

type Props = {
  genre: string;
  isSelected: boolean;
  onClick: () => void;
};

const ThemeTab = ({ genre, isSelected, onClick }: Props) => {
  return (
    <div
      className={`flex items-center justify-center py-[6px] px-4 rounded-full cursor-pointer ${
        isSelected ? 'bg-[#9747FF]' : 'bg-[#333]'
      }`}
      onClick={onClick}
    >
      #{genre}
    </div>
  );
};

export default ThemeTab;
