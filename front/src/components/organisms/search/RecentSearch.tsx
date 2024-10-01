import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchText from '../../atoms/commons/SearchText';

const RecentSearch = () => {
  const [searchTerms, setSearchTerms] = useState<string[]>([]);
  const navigate = useNavigate();

  // 로컬 스토리지에서 최근 검색어 불러오기
  useEffect(() => {
    const storedSearchTerms = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setSearchTerms(storedSearchTerms);
  }, []);

  // 특정 검색어 삭제 처리
  const handleDelete = (term: string) => {
    const updatedSearchTerms = searchTerms.filter(item => item !== term);
    setSearchTerms(updatedSearchTerms);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearchTerms));
  };

  // 검색어 클릭 시 검색 페이지로 이동
  const handleSearch = (term: string) => {
    navigate(`/search?keyword=${term}`);
  };

  return (
    <div className="w-full flex flex-wrap">
      {searchTerms.map((term, index) => (
        <SearchText
          key={index}
          term={term}
          onDelete={() => handleDelete(term)}
          onClick={() => handleSearch(term)}
        />
      ))}
    </div>
  );
};

export default RecentSearch;
