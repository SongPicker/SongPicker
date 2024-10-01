import React from 'react';
import { IoIosClose } from 'react-icons/io';

type Props = {
  term: string;
  onDelete: () => void;
  onClick: () => void;
};

const SearchText = ({ term, onDelete, onClick }: Props) => {
  return (
    <div
      className="inline-flex items-center px-[10px] py-[5px] bg-[#333] rounded-full cursor-pointer mr-2 mb-2"
      onClick={onClick}
    >
      <p className="me-1 text-sm">{term}</p>
      <IoIosClose
        className="text-lg cursor-pointer"
        onClick={e => {
          e.stopPropagation();
          onDelete();
        }}
      />
    </div>
  );
};

export default SearchText;
