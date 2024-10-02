import React from 'react';
import BellAlertIcon from '../../atoms/commons/BellAlertIcon';
import PlayListIcon from '../../atoms/commons/PlayListIcon';

type Props = {
  onPlayListClick: () => void;
};

const TopNavbarRightList = ({ onPlayListClick }: Props) => {
  return (
    <div className="flex items-center">
      <BellAlertIcon />
      <div onClick={onPlayListClick}>
        <PlayListIcon />
      </div>
    </div>
  );
};

export default TopNavbarRightList;
