import axios from 'axios';
import axiosInstance from './axiosInstance';

// 서비스연동 (개별)
export const connectService = async (serialNumber: string) => {
  const response = await axiosInstance({
    method: 'POST',
    url: '/api/connections',
    data: { serialNumber },
  });
  return response.data;
};

// 서비스연동 (그룹)
export interface ConnectGroupServiceRequest {
  serialNumber: string;
  groupId: number;
}

export const connectGroupService = async (data: ConnectGroupServiceRequest) => {
  const response = await axiosInstance({
    method: 'POST',
    url: '/api/connections/group',
    data,
  });
  return response.data;
};

// 노래 예약하기
export const reserveSong = async (serialNumber: string, songNumber: number) => {
  const response = await axiosInstance({
    method: 'POST',
    url: '/api/connections/reservations',
    data: { serialNumber, songNumber },
  });
  return response.data;
};

// 연결상태 확인
export const checkConnectionStatus = async () => {
  const response = await axiosInstance({
    method: 'GET',
    url: '/api/connections',
  });
  return response.data;
};

// 연동해지
export const disconnectService = async () => {
  const response = await axiosInstance({
    method: 'DELETE',
    url: '/api/connections',
  });
  console.log('Disconnect service response:', response.data);
  return response.data;
};
