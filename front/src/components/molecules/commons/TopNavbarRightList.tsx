import React, { RefObject } from 'react';
import BellAlertIcon from '../../atoms/commons/BellAlertIcon';
import PlayListIcon from '../../atoms/commons/PlayListIcon';

type Props = {
  onPlayListClick: () => void;
  onAlarmClick: () => void;
  onGroupInvite: () => void;
  bellIconRef: RefObject<HTMLDivElement>;
};

const TopNavbarRightList = ({
  onPlayListClick,
  onAlarmClick,
  onGroupInvite,
  bellIconRef,
}: Props) => {
  return (
    <div className="flex items-center justify-center">
      <div ref={bellIconRef} className="flex items-center">
        <BellAlertIcon onClick={onAlarmClick} onGroupInvite={onGroupInvite} />
      </div>
      <div onClick={onPlayListClick}>
        <PlayListIcon />
      </div>
    </div>
  );
};

export default TopNavbarRightList;
