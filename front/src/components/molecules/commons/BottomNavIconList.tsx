import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchIcon from '../../atoms/commons/SearchIcon';
import HashtagIcon from '../../atoms/commons/HashtagIcon';
import HomeIcon from '../../atoms/commons/HomeIcon';
import GroupIcon from '../../atoms/commons/GroupIcon';
import PersonIcon from '../../atoms/commons/PersonIcon';

function BottomNavIconList() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/home') return true;
    return location.pathname === path;
  };

  return (
    <div className="flex justify-around items-center w-full">
      <Link to="/search">
        <SearchIcon isActive={isActive('/search')} />
      </Link>
      <Link to="/theme">
        <HashtagIcon isActive={isActive('/theme')} />
      </Link>
      <Link to="/">
        <HomeIcon isActive={isActive('/')} />
      </Link>
      <Link to="/group">
        <GroupIcon isActive={isActive('/group')} />
      </Link>
      <Link to="/members">
        <PersonIcon isActive={isActive('/members')} />
      </Link>
    </div>
  );
};

export default BottomNavIconList;
