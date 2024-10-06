import axiosInstance from './axiosInstance';

// 사용자 프로필
export const getUserProfile = () => {
  return axiosInstance({
    method: 'GET',
    url: '/api/members/profile-info',
  })
    .then(res => {
      return res.data.data;
    })
    .catch(err => {
      console.log(err);
    });
};

// 노래 부른 날
export const getSingingDay = (currentYear: number) => {
  return axiosInstance({
    method: 'GET',
    url: '/histories/date',
    params: {
      year: currentYear,
    },
  })
    .then(res => {
      console.log(res.data.data);
      return res.data.data.singAt;
    })
    .catch(err => {
      console.log(err);
    });
};

// 부른 노래 목록
export const getSongList = (selectedYear: number, selectedMonth: number, selectedDay: number) => {
  return axiosInstance({
    method: 'GET',
    url: '/histories/date/songs',
    params: {
      year: selectedYear,
      month: selectedMonth,
      day: selectedDay,
    },
  })
    .then(res => {
      return res.data.data;
    })
    .catch(err => {
      console.log(err);
      return [];
    });
};
