import axiosInstance from './axiosInstance';

export const getSingingDay = (currentYear: number) => {
  return axiosInstance({
    method: 'GET',
    url: '/api/histories/date',
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
