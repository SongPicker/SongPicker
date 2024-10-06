import TopSongItem from '../../molecules/profile/TopSongItem';

type TopSongListProps = {
  topSongList: {
    title: string;
    singer: string;
    coverImage: string;
    count: number;
  }[];
};

const TopSongList = (props: TopSongListProps) => {
  return (
    <div className="flex flex-col w-full bg-white text-black items-center rounded-xl p-4 gap-4">
      {props.topSongList.map((item, i) => {
        return (
          <TopSongItem
            topSongItem={item}
            rank={i + 1}
            key={`topSong-${item.title}-${item.singer}`}
          />
        );
      })}
    </div>
  );
};

export default TopSongList;
