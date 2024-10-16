import React from 'react';
import Album from '../../atoms/commons/Album';
import TitleAritst from '../../atoms/commons/TitleAritst';

type Props = {
  title: string;
  artist: string;
  imageUrl: string;
  number: string;
};

const LeftMusicItem = ({ title, artist, imageUrl, number }: Props) => {
  return (
    <div className="flex max-w-full">
      {/* 앨범 */}
      <div className="mr-2 flex-shrink-0">
        <Album imageUrl={imageUrl} number={number} size={50} />
      </div>

      {/* 곡제목 및 가수 */}
      <div className="flex-grow overflow-hidden">
        <TitleAritst title={title} artist={artist} />
      </div>
    </div>
  );
};

export default LeftMusicItem;
