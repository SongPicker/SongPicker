import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import useAuthStore from '../stores/useAuthStore'; // useAuthStore 가져오기
import MyCalendar from '../components/organisms/profile/MyCalendar';
import { useQuery } from '@tanstack/react-query';
import { getSingingDay } from '../services/profileService';
import CalendarModal from '../components/organisms/profile/CalendarModal';

const ProfilePage = () => {
  const { logout } = useAuthStore(); // useAuthStore에서 logout 함수 가져오기
  const handleLogout = async () => {
    try {
      await logout(); // 로그아웃 실행
      console.log('로그아웃 완료');
      // 추가적인 후처리 필요 시 여기에 작성 (예: 리다이렉트)
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  // 노래 부른 날 색칠
  const currentYear = new Date().getFullYear();

  const { data: singingDayData } = useQuery<Date[]>({
    queryKey: ['karaokeDay', currentYear],
    queryFn: () => {
      return getSingingDay(currentYear);
    },
  });

  // 해당 일자에 부른 노래
  const [selectedYear, setSelectedYear] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedDate, setSelectedDate] = useState(0);
  const [openCalendarModal, setOpenCalendarModal] = useState(false);

  const handleSelectedDate = (value: Date) => {
    console.log('날짜 변경');
    setSelectedYear(value.getFullYear());
    setSelectedMonth(value.getMonth() + 1);
    setSelectedDate(value.getDate());
    setOpenCalendarModal(true);
  };

  const handleModal = () => {
    setOpenCalendarModal(false);
  };

  return (
    <MainLayout title="마이페이지">
      <button className="btn" onClick={handleLogout}>
        임시로그아웃버튼
      </button>
      <div className="flex w-full justify-center">
        <MyCalendar
          singingDayData={singingDayData || []}
          handleSelectedDate={handleSelectedDate}
          currentYear={currentYear}
        />
      </div>
      {openCalendarModal && (
        <CalendarModal
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          selectedDate={selectedDate}
          handleModal={handleModal}
        />
      )}
    </MainLayout>
  );
};

export default ProfilePage;
