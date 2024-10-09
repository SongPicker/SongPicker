import axiosInstance from '../services/axiosInstance';
import { ReservationItem } from '../shared/Types';


const saveSingSong = (props:ReservationItem) => {
  return axiosInstance({
    method: 'POST',
    url: 'start-song',
    data: {
      serialNumber: 'D208-SongPicker',
      number: props.number,
      nickname: props.nickname,
      teamId: props.teamId,
      mode: props.mode,
    },
  })
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    });
};

export default saveSingSong;