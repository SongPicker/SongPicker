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

export const verifyPassword = (existPassword: string) => {
  return axiosInstance({
    method: 'POST',
    url: '/api/auths/password/verify',
    data: {
      password: existPassword,
    },
  })
    .then(res => {
      console.log(res);
      return res.data.code;
    })
    .catch(err => {
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

export const changeProfileImage = (profileImg: File) => {
  const formData = new FormData();
  formData.append('profileImage', profileImg);

  return axiosInstance({
    method: 'PATCH',
    url: '/api/members/profile-image',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(res => {
      console.log('프로필 이미지 변경 성공:', res);
      return res.data;
    })
    .catch(err => {
      console.error('프로필 이미지 변경 실패:', err);
      throw err;
    });
};
