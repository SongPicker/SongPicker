import React from 'react';
import MusicItem from '../commons/MusicItem';

type Props = {};

const ThemeSongList = (props: Props) => {
  return (
    <div>
      {/* 노래리스트 */}
      <div
        className="w-full p-3 rounded-xl min-h-screen"
        style={{ background: 'linear-gradient(to bottom, #9747FF, #575ED2)' }}
      >
        {/* 테마제목 */}
        <p className="font-semibold text-lg"># 파티에 어울리는 곡 </p>
        {/* <MusicItem /> */}
      </div>
    </div>
  );
};

export default ThemeSongList;
