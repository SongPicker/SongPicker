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

// 그룹 선곡 추천 API
export const getTeamRecommendations = async (teamId: number) => {
  const response = await axiosInstance({
    method: 'GET',
    url: '/api/songs/team/recommendations',
    params: { teamId },
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

// 찜 목록 인터페이스
export interface LikedSong {
  number: string;
  coverImage: string;
  title: string;
  singer: string;
  likeId: number;
}

// 찜 목록 조회 API
export const getLikedSongs = async () => {
  const response = await axiosInstance({
    method: 'GET',
    url: '/api/likes',
  });
  return response.data.data;
};

// 찜 등록 API
export const registerLike = async (songId: number) => {
  const response = await axiosInstance({
    method: 'POST',
    url: '/api/likes',
    data: { songId },
  });
  return response.data;
};

// 찜 삭제 API
export const deleteLike = async (songNumber: number) => {
  const response = await axiosInstance({
    method: 'DELETE',
    url: `/api/likes/${songNumber}`,
  });
  return response.data;
};

// 노래 예약 API
export const reserveSong = async (number: number) => {
  const response = await axiosInstance({
    method: 'POST',
    url: '/api/connections/reservations',
    data: { number },
  });
  return response.data;
};

// 테마 목록 랜덤 조회 API
export const getRandomThemes = async () => {
  const response = await axiosInstance({
    method: 'GET',
    url: '/api/songs/themes-random',
  });
  return response.data;
};

// 테마 목록 전체 조회 API
export const getAllThemes = async () => {
  const response = await axiosInstance({
    method: 'GET',
    url: '/api/songs/themes-total',
  });
  return response.data;
};

// 테마별 노래추천
// export interface ThemedSongRecommendation {
//   themeTitle: string;
//   songList: {
//     songId: number;
//     number: number;
//     title: string;
//     singer: string;
//     coverImage?: string;
//     isLike: boolean;
//     likeId: number | null;
//   }[];
// }

export interface Song {
  songId: number;
  number: number;
  title: string;
  singer: string;
  coverImage?: string;
  isLike: boolean;
  likeId: number | null;
}

export interface ThemedSongRecommendation {
  themeTitle: string;
  list: Song[];
}

// 테마 전체 노래리스트 API
export const getThemedSongRecommendations = async (theme: string) => {
  const response = await axiosInstance({
    method: 'GET',
    url: '/api/songs',
    params: { theme },
  });
  return response.data;
};
