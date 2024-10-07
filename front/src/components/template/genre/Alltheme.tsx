import React from 'react';
import ThemeTab from '../../atoms/genre/themeTab';
import ThemeSongList from '../../organisms/genre/ThemeSongList';

type Props = {};

const Alltheme = (props: Props) => {
  return (
    <div>
      {/* 탭 */}
      <div className="mb-6 flex gap-3 w-[5000px]">
        <ThemeTab />
        <ThemeTab />
        <ThemeTab />
        <ThemeTab />
        <ThemeTab />
        <ThemeTab />
        <ThemeTab />
        <ThemeTab />
        <ThemeTab />
        <ThemeTab />
      </div>

      {/* 노래리스트 */}
      <div className='px-2'>
        <ThemeSongList />
      </div>
    </div>
  );
};

export default Alltheme;
