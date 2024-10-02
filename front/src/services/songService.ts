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

// 최근 노래
export interface RecentSong {
  number: number;
  coverImage: string;
  title: string;
  singer: string;
  isLike: boolean;
  likeId: number | null;
}

// 최근 노래 조회(그룹) API
export const getRecentSongs = async (teamId: number) => {
  const response = await axiosInstance({
    method: 'GET',
    url: `/api/histories/team/recent-songs?teamId=${teamId}`,
  });
  return response.data;
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