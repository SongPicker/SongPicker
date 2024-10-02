import ChartItem from '../molecules/ChartItem';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Reservation } from '../shared/Types';
import findYoutube from '../utils/findYoutube';

type ChartNotCarouselProps = {
  data: Reservation;
};

const ChartNotCarousel = (props: ChartNotCarouselProps) => {
  const navigate = useNavigate();
  const [clickedTitle, setClickedTitle] = useState('');
  const [clickedArtist, setClickedArtist] = useState('');

  // 클릭한 노래 상태 변경
  const handleClickedSong = useCallback((title: string, artist: string) => {
    setClickedTitle(title);
    setClickedArtist(artist);
  }, []);

  // 클릭한 노래가 변경되면 유튜브 검색을 실행
  useEffect(() => {
    if (clickedTitle && clickedArtist) {
      findYoutube(clickedTitle, clickedArtist, navigate);
    }
  }, [clickedTitle, clickedArtist]);

  return (
    <div className="relative w-full">
      <div className="flex flex-col w-full items-center gap-2">
        {/* 차트 닉네임 */}
        <div className="flex w-[610px] h-20 justify-center items-center text-white tracking-wide last:*:drop-shadow-md"></div>

        {/* 차트 */}
        <div className="h-full grid grid-cols-1 gap-y-1 overflow-auto">
          {props.data.map((item, i) => {
            return (
              <ChartItem
                data={item}
                handleClickedSong={handleClickedSong}
                key={`reserve-${item.number}-${i}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChartNotCarousel;
