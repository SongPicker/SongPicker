import axiosInstance from './axiosInstance';

// 최근 부른 곡 인터페이스
export interface RecentSong {
  songId(arg0: string, songId: unknown): unknown;
  number: number;
  coverImage: string;
  title: string;
  singer: string;
  isLike: boolean;
  likeId: number | null;
}

// 최근 부른 곡 조회(개인) API
export const getMyRecentSongs = async (): Promise<RecentSong[]> => {
  const response = await axiosInstance({
    method: 'GET',
    url: '/api/histories/my/recent-songs',
  });

  // 응답의 data 속성을 반환합니다.
  return response.data?.data ?? [];
};

// 최근 노래 조회(그룹) API
