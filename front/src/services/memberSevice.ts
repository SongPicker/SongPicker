import axiosInstance from './axiosInstance';

// 닉네임 조회
export const fetchNickname = async () => {
  const response = await axiosInstance({
    method: 'GET',
    url: '/api/members/nickname',
  });
  return response.data;
};
