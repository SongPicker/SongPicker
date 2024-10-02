// import ChartItem from '../molecules/ChartItem';
// import CarouselLeft from '../assets/CarouselLeft.svg';
// import CarouselRight from '../assets/CarouselRight.svg';
// import Text36 from '../atoms/Text36';
// import axios from 'axios';
// import { useCallback, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// type ChartCarouselProps = {
//   data: {
//     nicknames: {
//       nickname: string;
//       songs: {
//         songNumber: number;
//         title: string;
//         artist: string;
//       }[];
//     }[];
//   };
// };

// type ChartCarouselItemProps = {
//   data: {
//     nickname: string;
//     songs: {
//       songNumber: number;
//       title: string;
//       artist: string;
//     }[];
//   };
//   id: number;
//   total: number;
//   handleClickedSong: (title: string, artist: string) => void;
//   handleCurrentChart: (i: number) => void;
// };

// const ChartCarouselItem = (props: ChartCarouselItemProps) => {
//   return (
//     <div id={`chart-${props.id}`} className="carousel-item relative w-full">
//       <div className="flex flex-col w-full items-center gap-2">
//         {/* 차트 닉네임 */}
//         <div className="flex w-[610px] h-20 bg-gradient-to-r from-[#565ed2] via-[#47c490] to-[#565ed2] justify-center items-center text-white tracking-wide last:*:drop-shadow-md">
//           {/* 왼쪽 화살표 */}
//           <div
//             className="btn bg-transparent border-none hover:bg-transparent hover:scale-125"
//             onClick={() => {
//               props.handleCurrentChart(props.id - 1 < 0 ? props.total - 1 : props.id - 1);
//             }}
//             style={props.total === 1 ? { display: 'none' } : {}}
//           >
//             <img src={CarouselLeft} />
//           </div>

//           {/* 닉네임 */}
//           <div className="w-96 px-6 text-center font-semibold">
//             <Text36 text={props.data.nickname} />
//           </div>

//           {/* 오른쪽 화살표 */}
//           <div
//             className="btn bg-transparent border-none hover:bg-transparent hover:scale-125"
//             onClick={() => {
//               props.handleCurrentChart(props.id + 1 > props.total - 1 ? 0 : props.id + 1);
//             }}
//             style={props.total === 1 ? { display: 'none' } : {}}
//           >
//             <img src={CarouselRight} />
//           </div>
//         </div>

//         {/* 차트 */}
//         <div className="h-full grid grid-cols-1 gap-y-1 overflow-auto">
//           {props.data.songs.map(item => {
//             return (
//               // <ChartItem
//               //   song={item}
//               //   handleClickedSong={props.handleClickedSong}
//               //   key={item.songNumber}
//               // />
//               <div></div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// const ChartCarousel = (props: ChartCarouselProps) => {
//   const navigate = useNavigate();

//   const [clickedTitle, setClickedTitle] = useState('');
//   const [clickedArtist, setClickedArtist] = useState('');
//   const [currentChart, setCurrentChart] = useState(0);

//   // 유튜브 검색
//   const findYoutube = (title: string, artist: string) => {
//     axios({
//       method: 'GET',
//       url: 'https://www.googleapis.com/youtube/v3/search',
//       params: {
//         key: import.meta.env.VITE_YOUTUBE_API_KEY,
//         q: `${title} ${artist} Ky Karaoke`,
//         maxResults: 1,
//         publishedBefore: '2024-09-24T00:00:00Z',
//         publishedAfter: '2021-01-01T00:00:00Z',
//       },
//     })
//       .then(res => {
//         navigate('/video', { state: res.data.items[0] });
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   };

//   // 클릭한 노래 상태 변경
//   const handleClickedSong = useCallback((title: string, artist: string) => {
//     setClickedTitle(title);
//     setClickedArtist(artist);
//   }, []);

//   const handleCurrentChart = (i: number) => {
//     setCurrentChart(i);
//   };

//   // 클릭한 노래가 변경되면 유튜브 검색을 실행
//   useEffect(() => {
//     if (clickedTitle && clickedArtist) {
//       findYoutube(clickedTitle, clickedArtist);
//     }
//   }, [clickedTitle, clickedArtist]);

//   return (
//     <div className="carousel w-full h-full">
//       {props.data.nicknames.map((item, i) => {
//         return (
//           currentChart === i && (
//             <ChartCarouselItem
//               data={item}
//               id={i}
//               total={props.data.nicknames.length}
//               key={`chartcarousel-${i}`}
//               handleClickedSong={handleClickedSong}
//               handleCurrentChart={handleCurrentChart}
//             />
//           )
//         );
//       })}
//     </div>
//   );
// };

// export default ChartCarousel;
