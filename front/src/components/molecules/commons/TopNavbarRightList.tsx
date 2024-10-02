import React from 'react';
import BellAlertIcon from '../../atoms/commons/BellAlertIcon';
import PlayListIcon from '../../atoms/commons/PlayListIcon';

type Props = {
  onPlayListClick: () => void;
  onAlarmClick: () => void;
  onGroupInvite: () => void;
};

const TopNavbarRightList = ({ onPlayListClick, onAlarmClick, onGroupInvite }: Props) => {
  return (
    <div className="flex items-center">
      <BellAlertIcon onClick={onAlarmClick} onGroupInvite={onGroupInvite} />
      <div onClick={onPlayListClick}>
        <PlayListIcon />
      </div>
    </div>
  );
};

export default TopNavbarRightList;
