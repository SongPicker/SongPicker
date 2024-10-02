import { useState } from 'react';
import MainBackground from '../assets/MainBackground.png';
import CircleButton from '../molecules/CircleButton';
import GuideQrcode from '../organisms/GuideQrcode';
import ChartTemplates from '../templates/ChartTemplate';
import { useFetchReservation } from '../hooks/useFetchReservation';

const MainPage = () => {
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [showReservation, setShowReservation] = useState(false);
  const { data: reservationData, isLoading: reservationIsLoading } = useFetchReservation();

  // 추천 차트 오픈
  const handleRecommendation = () => {
    setShowRecommendation(!showRecommendation);
  };

  // 예약 차트 오픈
  const handleReservation = () => {
    setShowReservation(!showReservation);
  };

  if (reservationIsLoading) {
    return <div>로딩로딩로딩</div>;
  }

  // console.log('예약ㄱㄱ', reservationData)
  return (
    <div
      className="relative w-full h-full bg-cover bg-center mb-11"
      style={{
        backgroundImage: `url(${MainBackground})`,
      }}
    >
      {(showRecommendation || showReservation) !== true ? (
        <div className="flex flex-col h-full absolute right-14 justify-center items-center gap-7">
          <div className="flex gap-7">
            <CircleButton text="추천 차트" handleClick={handleRecommendation} color="bg-pink" />
            <CircleButton text="예약 목록" handleClick={handleReservation} color="bg-blue" />
          </div>
          <div>
            <GuideQrcode />
          </div>
        </div>
      ) : (
        <></>
      )}

      {/* 추천 차트 */}
      {showRecommendation && (
        <div className="flex h-full">
          {/* <ChartTemplates chartName="SongPicker 추천 차트" closeChart={handleRecommendation} /> */}
        </div>
      )}

      {/* 예약 목록 */}
      {showReservation && (
        <div className="flex h-full">
          <ChartTemplates
            chartName="SongPicker 예약 목록"
            closeChart={handleReservation}
            data={reservationData || []}
            isLoading={reservationIsLoading}
          />
        </div>
      )}
    </div>
  );
};

export default MainPage;
