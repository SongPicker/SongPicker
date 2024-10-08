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

export const changePassword = (
  existPassword: string,
  newPassword: string,
  checkPassword: string
) => {
  return axiosInstance({
    method: 'PATCH',
    url: '/api/members/password',
    data: {
      existPassword: existPassword,
      newPassword: newPassword,
      checkPassword: checkPassword,
    },
  })
    .then(res => {
      console.log('요청', existPassword, newPassword, checkPassword);
      console.log('요청 성공', res);

      return res.data.code;
    })
    .catch(err => {
      console.log(err);
    });
};
