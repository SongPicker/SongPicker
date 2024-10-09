import TopSongItem from '../../molecules/profile/TopSongItem';
import { PiMicrophoneStageDuotone } from 'react-icons/pi';

type TopSongListProps = {
  totalSingingCount: number;
  topSongList: {
    title: string;
    singer: string;
    coverImage: string;
    count: number;
  }[];
};

const TopSongList = ({ totalSingingCount, topSongList }: TopSongListProps) => {
  if (topSongList.length === 0) {
    return (
      <div className="w-full h-[260px] bg-[#fff] rounded-xl flex items-center justify-center flex-col">
        <PiMicrophoneStageDuotone className="size-10 text-purple-400 mb-4" />
        <div className="text-center text-purple-400 font-semibold">
          <p>아직 songpicker를 이용하지 않으셨군요!</p>
          <p>노래를 부르고 선호곡을 확인해보세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-white text-black items-center rounded-xl p-4 gap-4">
      {topSongList.map((item, i) => {
        return (
          <TopSongItem
            topSongItem={item}
            totalSingingCount={totalSingingCount}
            rank={i + 1}
            key={`topSong-${item.title}-${item.singer}`}
          />
        );
      })}
    </div>
  );
};

export default TopSongList;
