import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../services/axiosInstance';
import { Reservation } from '../shared/Types';

const fetchReservation = ():Promise<Reservation> => {
  return axiosInstance({
    method: 'GET',
    url: '/reservations',
    params: {
      serialNumber: 'D208-SongPicker',
    },
  })
    .then(res => {
      console.log(res.data.data);
      return res.data.data !== null ? res.data.data : [];
    })
    .catch(err => {
      console.error(err);
      throw err;
    });
};

export const useFetchReservation = () => {
  return useQuery({
    queryKey: ['reservationList'],
    queryFn: () => {
      return fetchReservation();
    },
  });
};
