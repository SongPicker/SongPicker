import ChartItem from '../molecules/ChartItem';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Reservation, SongItem } from '../shared/Types';
import findYoutube from '../utils/findYoutube';
import saveSingSong from '../utils/saveSingSong';
import ChartName from '../molecules/ChartName';
import Text36 from '../atoms/Text36';


type ReservationListProps = {
  data: Reservation;
  chartName: string;
  closeChart: () => void;
};

const ReservationList = (props: ReservationListProps) => {
  const navigate = useNavigate();
  const [clickedTitle, setClickedTitle] = useState('');
  const [clickedSinger, setClickedSinger] = useState('');

  // 클릭한 노래 상태 변경
  const handleClickedSong = useCallback((song: SongItem, order: number) => {
    setClickedTitle(song.title);
    setClickedSinger(song.singer);
    saveSingSong({ song, order });
  }, []);

  // 클릭한 노래가 변경되면 유튜브 검색을 실행
  useEffect(() => {
    if (clickedTitle && clickedSinger) {
      findYoutube(clickedTitle, clickedSinger, navigate);
    }
  }, [clickedTitle, clickedSinger]);

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* 고정됨 - 스크롤 안됨 */}
      <div className='relative flex w-full h-20 flex-shrink-0 z-9'>
        {/* 차트 이름 */}
        <div className="absolute top-3 left-14">
          <ChartName text={props.chartName} />
        </div>

        {/* 닫기 버튼 */}
        <div
          className="btn absolute w-32 h-[70px] top-3 right-5 bg-transparent border-2 text-[#80F9C6] hover:bg-ghost"
          onClick={() => {
            props.closeChart();
          }}
        >
          <Text36 text="닫기" />
        </div>

      </div>
      {/* 차트 */}
      <div className='flex-grow overflow-auto mt-4'>
        <div className="grid grid-cols-1 gap-y-1">
          {props.data.map((item, i) => {
            return (
              <ChartItem
                data={item}
                handleClickedSong={handleClickedSong}
                index={i}
                key={`reserve-${item.number}-${i}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReservationList;
