import ChartName from '../molecules/ChartName';
import LandingCharacter from '../assets/LandingCharacter.svg';
import Text36 from '../atoms/Text36';
import { ChartTemplateProps, Reservation, UserData } from '../shared/Types';
import ReservationList from '../organisms/ReservationList';
import RecommendCarousel from '../organisms/RecommendCarousel';
import RecommendTeamCarousel from '../organisms/RecommendTeamCarousel';

const ChartTemplate = (props: ChartTemplateProps) => {
  return (
    <div className="relative w-full flex justify-center items-end">
      {/* 차트 */}
      <div className="relative rounded-box bg-black/80 h-5/6 mb-1 pt-3 ">
        {props.type === 'reservation' ? (
          <div className="h-full">
            <ReservationList data={props.data as Reservation} />
          </div>
        ) : props.type === 'recommendation' && props.mode === 'INDIVIDUAL' ? (
          <div className="h-full">
            <RecommendCarousel data={props.data as UserData[]} mode={props.mode} />
          </div>
        ) : props.type === 'recommendation' && props.mode === 'TEAM' ? (
          <div className="h-full">
            <RecommendTeamCarousel data={props.data as UserData[]} mode={props.mode} />
          </div>
        ) : (
          <></>
        )}

        {/* 이미지 */}
        <div className="absolute z-10 w-44 -top-24 -left-24 -rotate-12">
          <img src={LandingCharacter} />
        </div>

        {/* 차트 이름 */}
        <div className="absolute top-3 left-5">
          <ChartName text={props.chartName} />
        </div>

        {/* 닫기 버튼 */}
        <div
          className="btn absolute w-28 h-16 top-3 right-5 bg-transparent border-2 text-[#80F9C6] hover:bg-ghost"
          onClick={() => {
            props.closeChart();
          }}
        >
          <Text36 text="닫기" />
        </div>
      </div>
    </div>
  );
};

export default ChartTemplate;
