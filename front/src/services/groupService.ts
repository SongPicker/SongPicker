import axiosInstance from './axiosInstance';

// 그룹 목록 조회
export const getGroupList = async () => {
  const response = await axiosInstance.get('/api/teams');
  return response.data;
};

// 그룹 생성
export const createGroup = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/api/teams', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Create group error:', error);
    throw error;
  }
};

// 그룹 편집
export const editGroup = async (teamId: number, formData: FormData) => {
  const response = await axiosInstance.put(`/api/teams/${teamId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// 그룹 상세 조회
export const getGroupDetail = async (teamId: number) => {
  const response = await axiosInstance.get(`/api/teams/${teamId}`);
  return response.data;
};

// 그룹 나가기
export const leaveGroup = async (teamId: number) => {
  try {
    const response = await axiosInstance.delete(`/api/teams?teamId=${teamId}`);
    return response.data;
  } catch (error) {
    console.error('Leave group error:', error);
    throw error;
  }
};
