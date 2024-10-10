import { SongItem } from "../shared/Types";
import ChartItem from '../molecules/ChartItem';
import CarouselLeft from '../assets/CarouselLeft.svg';
import CarouselRight from '../assets/CarouselRight.svg';
import Text36 from "../atoms/Text36";

type RecommendCarouselItemProps = {
    data: SongItem[];
    id: number;
    total: number;
    handleClickedSong: (song: SongItem) => void;
    handleCurrentChart: (index: number) => void;
    nickname: string | null;
  };

const RecommendCarouselItem = (props: RecommendCarouselItemProps) => {
  console.log('캐러셀 아이템', props.data);
  return (
    <div id={`chart-${props.id}`} className="carousel-item relative w-full">
      <div className="flex flex-col w-full items-center gap-2">
        {/* 차트 닉네임 */}
        <div className="flex w-[610px] h-20 bg-gradient-to-r from-[#565ed2] via-[#47c490] to-[#565ed2] justify-center items-center text-white tracking-wide last:*:drop-shadow-md">
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
          <div className="w-96 px-6 text-center font-semibold">
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

        {/* 차트 */}
        <div className="h-full grid grid-cols-1 gap-y-1 overflow-auto">
          {props.data.map(item => {
            return (
              <ChartItem
                data={item}
                handleClickedSong={props.handleClickedSong}
                key={item.number}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecommendCarouselItem;
