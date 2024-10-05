import React from 'react';
import LeftMusicItem from '../../molecules/commons/LeftMusicItem';
import RightMusicItem from '../../molecules/commons/RightMusicItem';

type Props = {
  id: string;
  number: string;
  title: string;
  artist: string;
  imageUrl: string;
  isLiked: boolean;
  onLikeToggle: () => void;
  onShowConnectionModal: (message: string) => void;
  onItemClick: (music: { id: string; title: string; artist: string; imageUrl: string }) => void;
  isConnected: boolean;
};

const MusicItem = ({
  id,
  number,
  title,
  artist,
  imageUrl,
  isLiked,
  onLikeToggle,
  onShowConnectionModal,
  onItemClick,
  isConnected,
}: Props) => {
  const handleClick = () => {
    onItemClick({ id, title, artist, imageUrl });
  };
  return (
    <div className="flex items-center justify-between w-full px-2 py-1 rounded-md cursor-pointer">
      <div className="flex-grow overflow-hidden mr-2" onClick={handleClick}>
        <LeftMusicItem title={title} artist={artist} imageUrl={imageUrl} number={number} />
      </div>
      <div className="flex-shrink-0">
        <RightMusicItem
          isLiked={isLiked}
          onLikeToggle={onLikeToggle}
          onShowConnectionModal={onShowConnectionModal}
          number={number}
          isConnected={isConnected}
        />
      </div>
    </div>
  );
};
export default MusicItem;
