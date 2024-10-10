import LandingCharacter from '../assets/LandingCharacter.svg';
import { ChartTemplateProps, Reservation, UserData } from '../shared/Types';
import ReservationList from '../organisms/ReservationList';
import RecommendCarousel from '../organisms/RecommendCarousel';
import RecommendTeamCarousel from '../organisms/RecommendTeamCarousel';

const ChartTemplate = (props: ChartTemplateProps) => {
  return (
    <div className="relative w-full flex justify-center items-center mt-4">

      <div className="relative rounded-box bg-black/80 w-[90%] h-5/6 flex flex-col">
        {/* 이미지 */}
        <div className="absolute z-10 w-32 -top-20 -left-[70px] -rotate-12">
          <img src={LandingCharacter} />
        </div>
     
        {props.type === 'reservation' ? (
          <div className="w-full h-full">
            <ReservationList
              data={props.data as Reservation}
              chartName={props.chartName}
              closeChart={props.closeChart} 
            />
          </div>
        ) : props.type === 'recommendation' && props.mode === 'INDIVIDUAL' ? (
          <div className="w-full h-full">
            <RecommendCarousel
              data={props.data as UserData[]}
              mode={props.mode}
              chartName={props.chartName}
              closeChart={props.closeChart}
            />
          </div>
        ) : props.type === 'recommendation' && props.mode === 'TEAM' ? (
          <div className="w-full h-full">
            <RecommendTeamCarousel
              data={props.data as UserData[]}
              mode={props.mode}
              chartName={props.chartName}
              closeChart={props.closeChart}
            />
          </div>
        ) : (
          <></>
        )}

        
      </div>
    </div>

  );
};

export default ChartTemplate;
