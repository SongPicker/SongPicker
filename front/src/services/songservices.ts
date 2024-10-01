import axios from 'axios';
import axiosInstance from './axiosInstance';

// 개인 선곡 추천 API
export const getPersonalRecommendations = async () => {
  const response = await axiosInstance({
    method: 'GET',
    url: '/api/songs/my/recommendations',
  });
  return response.data;
};

// 노래 상세 조회 API
export interface SongDetail {
  number: string;
  title: string;
  singer: string;
  coverImage?: string;
  genre: string;
  lyricist: string;
  composer: string;
  lyrics: string;
  releasedAt: string;
  isLike: boolean;
  likeId: number | null;
}

export const getSongDetail = async (songId: number | string) => {
  const response = await axiosInstance({
    method: 'GET',
    url: `/api/songs/${songId}`,
  });
  return response.data;
};

// 노래 검색 API 함수
// export const searchSongs = async (keyword: string) => {
//   const response = await axiosInstance({
//     method: 'GET',
//     url: '/api/songs/search',
//     params: { keyword },
//   });
//   return response.data;
// };

export const searchSongs = async (keyword: string) => {
  try {
    const response = await axiosInstance({
      method: 'GET',
      url: '/api/songs/search',
      params: { keyword },
    });

    // 응답 데이터 구조 확인 및 처리
    console.log('API Response:', response);
    if (response.data && response.data.body) {
      return response.data.body;
    } else if (response.data) {
      return response.data;
    } else {
      console.warn('Unexpected API response structure:', response);
      return { songSearchList: [] };
    }
  } catch (error) {
    console.error('Search API Error:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error response:', error.response);
    }
    throw error;
  }
};
