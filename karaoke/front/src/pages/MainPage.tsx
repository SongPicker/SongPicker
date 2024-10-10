import { useState } from 'react';
import MainBackground from '../assets/MainBackground.png';
import CircleButton from '../molecules/CircleButton';
import GuideQrcode from '../organisms/GuideQrcode';
import ChartTemplates from '../template/ChartTemplate';
import { useFetchReservation } from '../hooks/useFetchReservation';
import AlertModal from '../molecules/AlertModal';
import axiosInstance from '../services/axiosInstance';
import { UserData } from '../shared/Types';

const MainPage = () => {
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [showReservation, setShowReservation] = useState(false);
  const [showReserveAlert, setShowReserveAlert] = useState(false);
  const [showRecommendAlert, setShowRecommendAlert] = useState(false);
  const [userData, setUserData] = useState<UserData[]>([]);
  const [mode, setMode] = useState<'INDIVIDUAL' | 'TEAM' | ''>('');
  const {
    data: reservationData,
    isLoading: reservationIsLoading,
    refetch: refetchReservation,
  } = useFetchReservation();

  // 사용자 정보 확인 및 추천 차트 오픈
  const handleRecommendation = async () => {
    try {
      const response = await axiosInstance({
        method: 'GET',
        url: '/connections',
        params: {
          serialNumber: 'D208-SongPicker',
        },
      });
      console.log('연결 성공', response);
      const data: UserData[] = response.data.data || [];
      console.log('사용자', data);

      if (data.length === 0) {
        setShowRecommendAlert(true);
        return;
      }

      setUserData(data);
      setMode(data[0]?.mode || '');
      setShowRecommendation(true);
    } catch (err) {
      console.log('사용자 정보를 가져오는 중 오류가 발생했습니다.', err);
      setShowRecommendAlert(true);
    }
  };

  // 예약 차트 오픈
  const handleReservation = () => {
    if (!reservationData || reservationData.length === 0) {
      setShowReserveAlert(true);
    } else {
      setShowReservation(true);
      refetchReservation();
    }
  };

  const closeReserveAlert = () => {
    setShowReserveAlert(false);
  };

  const closeRecommendAlert = () => {
    setShowRecommendAlert(false);
  };

  if (reservationIsLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div
      className="relative w-full h-full bg-cover bg-center mb-11"
      style={{
        backgroundImage: `url(${MainBackground})`,
      }}
    >
      {!showRecommendation && !showReservation && (
        <div className="flex flex-col h-full absolute right-14 justify-center items-center gap-7">
          <div className="flex gap-7">
            <CircleButton text="추천 차트" handleClick={handleRecommendation} color="bg-pink" />
            <CircleButton text="예약 목록" handleClick={handleReservation} color="bg-blue" />
          </div>
          <div>
            <GuideQrcode />
          </div>
        </div>
      )}

      {/* 추천 차트 */}
      {showRecommendation && userData.length > 0 && (
        <div className="flex h-full">
          <ChartTemplates
            chartName="SongPicker 추천 차트"
            data={userData}
            closeChart={() => setShowRecommendation(false)}
            type="recommendation"
            mode={mode}
          />
        </div>
      )}

      {/* 예약 목록 */}
      {showReservation && (
        <div className="flex h-full">
          <ChartTemplates
            chartName="SongPicker 예약 목록"
            closeChart={() => setShowReservation(false)}
            data={reservationData || []}
            isLoading={reservationIsLoading}
            type="reservation"
          />
        </div>
      )}

      {/* 알림 모달 */}
      {showReserveAlert && (
        <AlertModal alertMessage="예약된 곡이 없습니다" closeAskPayModal={closeReserveAlert} />
      )}
      {showRecommendAlert && (
        <AlertModal alertMessage="연결된 계정이 없습니다" closeAskPayModal={closeRecommendAlert} />
      )}
    </div>
  );
};

export default MainPage;
