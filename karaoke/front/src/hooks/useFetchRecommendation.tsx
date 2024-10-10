import { useQueries, UseQueryResult } from '@tanstack/react-query';
import axiosInstance from '../services/axiosInstance';
import { SongItem, UserData } from '../shared/Types';

export const fetchIndividualRecommendation = (loginId: string) => {
  return axiosInstance({
    method: 'GET',
    url: '/individual/recommendations',
    params: {
      loginId: loginId,
    },
  })
    .then(res => {
      console.log(res);
      return res.data.data;
    })
    .catch(err => {
      console.error(err);
      throw err;
    });
};

export const fetchTeamRecommendation = (teamId: number) => {
  return axiosInstance({
    method: 'GET',
    url: '/team/recommendations',
    params: {
      teamId: teamId,
    },
  })
    .then(res => {
      console.log(res);
      return res.data.data;
    })
    .catch(err => {
      console.error(err);
      throw err;
    });
};

// 개인별 추천 차트 관리 훅
export const useFetchIndividualRecommendations = (
  userData: UserData[]
): UseQueryResult<SongItem[], Error>[] => {
  const individualQueries = userData.map(item => ({
    queryKey: ['individualRecommendation', item.loginId],
    queryFn: () => fetchIndividualRecommendation(item.loginId || ''),
  }));

  return useQueries({ queries: individualQueries });
};

export const useFetchTeamRecommendation = (
  userData: UserData[]
): UseQueryResult<SongItem[], Error>[] => {
  const teamQueries = userData.map(item => ({
    queryKey: ['teamRecommendation', item.teamId],
    queryFn: () => fetchTeamRecommendation(item.teamId || 0),
  }));

  return useQueries({ queries: teamQueries });
};
