import React, { useState, useEffect } from 'react';
import { IoMdSearch } from 'react-icons/io';

type Props = {
  onSearch: (keyword: string) => void;
  initialKeyword: string;
};

const SearchBar = ({ onSearch, initialKeyword }: Props) => {
  const [searchTerm, setSearchTerm] = useState(initialKeyword);

  useEffect(() => {
    setSearchTerm(initialKeyword);
  }, [initialKeyword]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      onSearch(searchTerm);
      updateRecentSearches(searchTerm);
    }
  };

  const updateRecentSearches = (term: string) => {
    let recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    recentSearches = recentSearches.filter((item: string) => item !== term);
    recentSearches.unshift(term);
    if (recentSearches.length > 10) recentSearches.pop();
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  };

  return (
    <div className="flex items-center w-full bg-[#333] rounded-full bg-opacity-60 px-4 py-2">
      <IoMdSearch className="text-xl flex-shrink-0 me-2" onClick={handleSearch} />
      <div className="w-full">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="곡 명, 가수로 검색"
          className="outline-none bg-transparent w-full"
        />
      </div>
    </div>
  );
};

export default SearchBar;
