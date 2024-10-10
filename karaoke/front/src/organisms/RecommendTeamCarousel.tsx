import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SongItem, UserData } from '../shared/Types';
import findYoutube from '../utils/findYoutube';
import { useFetchTeamRecommendation } from '../hooks/useFetchRecommendation';
import RecommendCarouselItem from './RecommendCarouselItem';

type RecommendTeamCarouselProps = {
  data: UserData[];
  mode: string;
};

const RecommendTeamCarousel = (props: RecommendTeamCarouselProps) => {
  const navigate = useNavigate();

  const [clickedTitle, setClickedTitle] = useState('');
  const [clickedSinger, setClickedSinger] = useState('');
  const [currentChart, setCurrentChart] = useState(0);

  // 클릭한 노래 상태 변경
  const handleClickedSong = useCallback((song: SongItem) => {
    setClickedTitle(song.title);
    setClickedSinger(song.singer);
  }, []);

  const handleCurrentChart = (i: number) => {
    setCurrentChart(i);
  };

  // 클릭한 노래가 변경되면 유튜브 검색을 실행
  useEffect(() => {
    if (clickedTitle && clickedSinger) {
      findYoutube(clickedTitle, clickedSinger, navigate);
    }
  }, [clickedTitle, clickedSinger]);

  return (
    <div className="carousel w-full h-full">
      {useFetchTeamRecommendation(props.data).map((userList, index) => {
        console.log('쿼리', userList.data);
        console.log('현재유저', props.data[index]);
        const currentUser = props.data[index];
        return (
          currentChart === index && (
            <div key={`chartCarousel-team-${index}`}>
              <RecommendCarouselItem
                data={userList.data || []}
                id={index}
                total={props.data.length}
                handleClickedSong={handleClickedSong}
                handleCurrentChart={handleCurrentChart}
                nickname={currentUser.teamName}
              />
            </div>
          )
        );
      })}
    </div>
  );
};

export default RecommendTeamCarousel;
