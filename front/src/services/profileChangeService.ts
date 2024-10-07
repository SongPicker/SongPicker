import axiosInstance from './axiosInstance';

export const changeNickname = (newNickName: string) => {
  return axiosInstance({
    method: 'PATCH',
    url: '/api/members/nickname',
    data: {
      newNickname: newNickName,
    },
  })
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    });
};
