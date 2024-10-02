import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const findYoutube = (title: string, artist: string, navigate: ReturnType<typeof useNavigate>) => {
  return axios({
    method: 'GET',
    url: 'https://www.googleapis.com/youtube/v3/search',
    params: {
      key: import.meta.env.VITE_YOUTUBE_API_KEY,
      q: `${title} ${artist} Ky Karaoke`,
      maxResults: 1,
      publishedBefore: '2024-09-24T00:00:00Z',
      publishedAfter: '2021-01-01T00:00:00Z',
    },
  })
    .then(res => {
      navigate('/video', { state: res.data.items[0] });
    })
    .catch(err => {
      console.log(err);
    });
};

export default findYoutube;
