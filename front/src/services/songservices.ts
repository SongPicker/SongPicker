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
