import { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import useAuthStore from '../stores/useAuthStore';
import MyCalendar from '../components/organisms/profile/MyCalendar';
import { useQuery } from '@tanstack/react-query';
import {
  getSingingDay,
  getTopGenreList,
  getTopSingerList,
  getTopSongList,
  getUserProfile,
  getThisMonthUseCount,
} from '../services/profileService';
import CalendarModal from '../components/organisms/profile/CalendarModal';
import ProfileCard from '../components/organisms/profile/ProfileCard';
import TopSongList from '../components/organisms/profile/TopSongList';
import TopSingerWordCloud from '../components/organisms/profile/TopSingerWordCloud';
import TopGenreItem from '../components/atoms/profile/TopGenreItem';

const ProfilePage = () => {
  const { logout } = useAuthStore();
  const [userProfile, setUserProfile] = useState({
    nickname: '',
    profileImage: '',
    name: '',
    gender: '',
    phone: '',
    loginId: '',
  });
  const [topSongList, setTopSongList] = useState([]);
  const [totalSingingCount, setTotalSingingCount] = useState(0);
  const [topSingerList, setTopSingerList] = useState([]);
  const [topGenreList, setTopGenreList] = useState([]);
  const [thisMonthUseCount, setThisMonthUseCount] = useState(0);

  const handleLogout = async () => {
    try {
      await logout();
      console.log('로그아웃 완료');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userProfileResponse = await getUserProfile();
        setUserProfile(
          userProfileResponse || {
            nickname: '',
            profileImage: '',
            name: '',
            gender: '',
            phone: '',
            loginId: '',
          }
        );

        const topSongListResponse = await getTopSongList();
        setTopSongList(topSongListResponse?.mostSongsList || []);
        setTotalSingingCount(topSongListResponse?.totalCount || 0);

        const topSingerListResponse = await getTopSingerList();
        setTopSingerList(topSingerListResponse || []);

        const topGenreResponse = await getTopGenreList();
        setTopGenreList(topGenreResponse || []);

        const thisMonthUseCountResponse = await getThisMonthUseCount();
        setThisMonthUseCount(thisMonthUseCountResponse || 0);

        await refetch();
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfileData();
  }, []);

  // 노래 부른 날 색칠
  const currentYear = new Date().getFullYear();

  const { data: singingDayData, refetch } = useQuery<Date[]>({
    queryKey: ['karaokeDay', currentYear],
    queryFn: () => {
      return getSingingDay(currentYear);
    },
    enabled: false,
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
        {/* 기본 분석 */}
        <div className="w-full">
          <p className="text-lg font-semibold p-2">{userProfile.nickname}님에 대한 분석</p>
          <div className="flex flex-col gap-2">
            <p className="text-md px-2">이번 달 SongPicker 사용 횟수 : {thisMonthUseCount}회</p>
            <p className="text-md px-2">가장 많이 부른 노래 장르 Top 3</p>
            <div className="flex gap-2 px-2">
              {topGenreList.length > 0 ? (
                topGenreList.map((item, i) => {
                  return <TopGenreItem name={item} key={`${item}-${i}`} />;
                })
              ) : (
                <p className="text-sm text-white">
                  아직 정보가 부족해요! SongPicker를 이용해보세요
                </p>
              )}
            </div>
          </div>
        </div>
        {/* 가장 많이 부른 노래 */}
        <div className="w-full ">
          <p className="text-lg font-semibold p-2">가장 많이 부른 곡 Top 3</p>
          <TopSongList topSongList={topSongList} totalSingingCount={totalSingingCount} />
        </div>

        {/* 노래방 방문한 날 (캘린더) */}
        <div className="w-full">
          <p className="text-lg font-semibold p-2">SongPicker 사용한 날</p>
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
