import React from 'react';
import LikeButton from '../../atoms/commons/LikeButton';
import ReservationButton from '../../atoms/commons/ReservationButton';

type Props = {
  number: string;
  isLiked: boolean;
  onLikeToggle: () => void;
  onShowConnectionModal: (message: string) => void;
  isConnected: boolean;
};

const RightMusicItem = ({
  number,
  isLiked,
  onLikeToggle,
  onShowConnectionModal,
  isConnected,
}: Props) => {
  return (
    <div className="flex">
      {/* 찜하기 버튼 */}
      <div className="mr-2 flex-shrink-0">
        <LikeButton isLiked={isLiked} onToggle={onLikeToggle} />
      </div>

      {/* 예약하기 버튼 */}
      <div className="flex-shrink-0">
        <ReservationButton
          onShowConnectionModal={onShowConnectionModal}
          number={number}
          isConnected={isConnected}
        />
      </div>
    </div>
  );
};

export default RightMusicItem;
