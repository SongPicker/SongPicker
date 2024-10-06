import React from 'react';
import { FcStatistics } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';

type Props = {
  nickname: string;
};

const UserStatisticsBanner = ({ nickname }: Props) => {
  const navigate = useNavigate();
  return (
    <div
      className="flex justify-between w-full h-[120px] bg-gradient-to-r from-[rgba(255,87,204,0.4)] to-[rgba(71,123,255,0.4)] p-4 cursor-pointer"
      onClick={() => navigate('/members/id')}
    >
      {/* 배너 멘트 */}
      <div>
        <p className="text-lg font-medium text-pink-300">
          <span className="font-pyeongchang font-thin">SongPicker</span> 사용 통계 확인해보기
        </p>
        <p className="text-sm mt-2 text-slate-100">
          <span>{nickname}</span>님이 많이 부른 노래를 확인해보세요.
        </p>
      </div>

      {/* 아이콘 */}
      <div className="flex items-end">
        <FcStatistics size={54} />
      </div>
    </div>
  );
};

export default UserStatisticsBanner;
