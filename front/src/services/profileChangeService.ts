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

export const changePhoneNumber = (newPhoneNumber: string) => {
  return axiosInstance({
    method: 'PATCH',
    url: '/api/members/phone',
    data: {
      newPhone: newPhoneNumber,
    },
  })
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(newPhoneNumber);
      console.log(err);
    });
};
