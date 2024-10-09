import React from 'react';
import { FaAngleRight } from 'react-icons/fa6';
import ColMusicItem from '../../organisms/commons/ColMusicItem';

type Props = {
  title: string;
  gradientColors: string;
  items: Array<{
    imageUrl: string;
    number: string;
    title: string;
    artist: string;
  }>;
  onMoreClick: () => void;
};

const RecomThemeBanner = ({ title, gradientColors, items, onMoreClick }: Props) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-medium">{title}</h2>
        <button onClick={onMoreClick} className="flex items-center">
          <p>더보기</p>
          <FaAngleRight />
        </button>
      </div>

      <div className={`w-full ${gradientColors} p-3 rounded-xl flex justify-between`}>
        {items.slice(0, 3).map((item, index) => (
          <div key={index} className="w-[32%]">
            <ColMusicItem {...item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecomThemeBanner;
