import { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import useAuthStore from '../stores/useAuthStore'; // useAuthStore 가져오기
import MyCalendar from '../components/organisms/profile/MyCalendar';
import { useQuery } from '@tanstack/react-query';
import {
  getSingingDay,
  getTopSingerList,
  getTopSongList,
  getUserProfile,
} from '../services/profileService';
import CalendarModal from '../components/organisms/profile/CalendarModal';
import ProfileCard from '../components/organisms/profile/ProfileCard';
import TopSongList from '../components/organisms/profile/TopSongList';
import TopSingerWordCloud from '../components/organisms/profile/TopSingerWordCloud';

const ProfilePage = () => {
  // 로그아웃
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

  // 프로필 표시 & 많이 부른 노래 & 많이 부른 가수
  const [userProfile, setUserProfile] = useState({
    nickname: '',
    profileImage: '',
  });
  const [topSongList, setTopSongList] = useState([]);
  const [topSingerList, setTopSingerList] = useState([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [userProfileResponse, topSongListResponse, topSingerListResponse] = await Promise.all(
          [getUserProfile(), getTopSongList(), getTopSingerList()]
        );

        setUserProfile(userProfileResponse);
        setTopSongList(topSongListResponse);
        setTopSingerList(topSingerListResponse);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfileData();
  }, []);

  // 노래 부른 날 색칠
  const currentYear = new Date().getFullYear();

  const { data: singingDayData } = useQuery<Date[]>({
    queryKey: ['karaokeDay', currentYear],
    queryFn: () => {
      return getSingingDay(currentYear);
    },
  });

  // 해당 일자에 부른 노래 모달
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
      {/* 프로필 */}
      <ProfileCard userProfile={userProfile} handleLogout={handleLogout} />

      <div className="flex flex-col px-4 items-center gap-6 py-6">
        {/* 가장 많이 부른 노래 */}
        <div className="w-full ">
          <p className="text-lg font-semibold p-2">가장 많이 부른 곡 Top 3</p>
          <TopSongList topSongList={topSongList} />
        </div>

        {/* 노래방 방문한 날 (캘린더) */}
        <div className="w-full">
          <p className="text-lg font-semibold p-2">노래방 방문한 날</p>
          <MyCalendar
            singingDayData={singingDayData || []}
            handleSelectedDate={handleSelectedDate}
            currentYear={currentYear}
          />
        </div>

        {/* 캘린더 모달 */}
        {openCalendarModal && (
          <CalendarModal
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            selectedDate={selectedDate}
            handleModal={handleModal}
          />
        )}

        {/* 내가 선호하는 아티스트 */}
        <div className="w-full">
          <p className="text-lg font-semibold p-2">선호하는 아티스트</p>
          <TopSingerWordCloud topSingerList={topSingerList} />
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
