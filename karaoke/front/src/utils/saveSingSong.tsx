import axiosInstance from '../services/axiosInstance';
import { SaveSingSong } from '../shared/Types';

const saveSingSong = (props: SaveSingSong) => {
  return axiosInstance({
    method: 'POST',
    url: 'start-song',
    data: {
      serialNumber: 'D208-SongPicker',
      number: props.song.number,
      nickname: props.song.nickname,
      teamId: props.song.teamId,
      mode: props.song.mode,
      order: props.order,
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
