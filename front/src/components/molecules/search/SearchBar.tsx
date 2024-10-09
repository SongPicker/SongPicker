import React, { useState, useEffect, useCallback } from 'react';
import { IoMdSearch } from 'react-icons/io';
import debounce from 'lodash/debounce';

type Props = {
  onSearch: (keyword: string) => void;
  onInputChange: (keyword: string) => void;
  initialKeyword: string;
};

const SearchBar = ({ onSearch, onInputChange, initialKeyword }: Props) => {
  const [searchTerm, setSearchTerm] = useState(initialKeyword);

  useEffect(() => {
    setSearchTerm(initialKeyword);
  }, [initialKeyword]);

  const debouncedInputChange = useCallback(
    debounce((term: string) => {
      onInputChange(term.trim());
    }, 300),
    [onInputChange]
  );

  // 입력값 변경 시 실시간 검색
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTerm = e.target.value;
    setSearchTerm(newTerm);
    debouncedInputChange(newTerm);
  };

  // Enter 키를 눌렀을 때 검색
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  // 검색 버튼 클릭 또는 Enter 키 눌렀을 때 검색 처리
  const handleSearch = () => {
    onSearch(searchTerm.trim());
  };

  return (
    <div className="flex items-center w-full bg-[#333] rounded-full bg-opacity-60 px-4 py-2">
      <IoMdSearch className="text-xl flex-shrink-0 me-2" onClick={handleSearch} />
      <div className="w-full">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="곡 명, 가수로 검색"
          className="outline-none bg-transparent w-full"
        />
      </div>
    </div>
  );
};

export default SearchBar;
