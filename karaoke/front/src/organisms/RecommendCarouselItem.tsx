import { SongItem } from "../shared/Types";
import ChartItem from '../molecules/ChartItem';
import CarouselLeft from '../assets/CarouselLeft.svg';
import CarouselRight from '../assets/CarouselRight.svg';
import Text36 from "../atoms/Text36";
import ChartName from '../molecules/ChartName';

type RecommendCarouselItemProps = {
    data: SongItem[];
    id: number;
    total: number;
    handleClickedSong: (song: SongItem) => void;
    handleCurrentChart: (index: number) => void;
    nickname: string | null;
    chartName: string;
    closeChart: () => void;

  };

const RecommendCarouselItem = (props: RecommendCarouselItemProps) => {
  console.log('캐러셀 아이템', props.data);
  return (
    <div id={`chart-${props.id}`} className="carousel-item relative w-full h-full flex flex-col">
      {/* 고정됨 - 스크롤 안됨 */}
      <div className='relative flex w-full h-20 flex-shrink-0 z-9'>
        {/* 차트 이름 */}
        <div className="absolute top-3 left-8">
          <ChartName text={props.chartName} />
        </div>

        {/* 차트 닉네임 */}
        <div className="flex px-2 mx-auto h-full bg-gradient-to-r from-[#565ed2] via-[#47c490] to-[#565ed2] justify-center items-center text-white tracking-wide last:*:drop-shadow-md">
          {/* 왼쪽 화살표 */}
          <div
            className="btn bg-transparent border-none hover:bg-transparent hover:scale-125"
            onClick={() => {
              props.handleCurrentChart(props.id - 1 < 0 ? props.total - 1 : props.id - 1);
            }}
            style={props.total === 1 ? { display: 'none' } : {}}
          >
            <img src={CarouselLeft} />
          </div>

          {/* 닉네임 */}
          <div className="w-[240px] text-center font-semibold">
            <Text36 text={props.nickname || ''} />
          </div>

          {/* 오른쪽 화살표 */}
          <div
            className="btn bg-transparent border-none hover:bg-transparent hover:scale-125"
            onClick={() => {
              props.handleCurrentChart(props.id + 1 > props.total - 1 ? 0 : props.id + 1);
            }}
            style={props.total === 1 ? { display: 'none' } : {}}
          >
            <img src={CarouselRight} />
          </div>
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

      {/* 차트  -  스크롤 시키기*/}
      <div className="flex-grow overflow-auto mt-4">
        <div className="grid grid-cols-1 gap-y-1">
          {props.data.map(item => (
            <ChartItem
              data={item}
              handleClickedSong={props.handleClickedSong}
              key={item.number}
            />
          ))}
        </div>
      </div>
    </div>

  );
};

export default RecommendCarouselItem;
