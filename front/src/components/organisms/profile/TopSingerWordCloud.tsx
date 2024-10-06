import WordCloud from 'react-d3-cloud';

type TopSingerWordCloudProps = {
  topSingerList: {
    singer: string;
    count: number;
  }[];
};

const TopSingerWordCloud = (props: TopSingerWordCloudProps) => {
  return <div className="w-full h-80 bg-white rounded-xl"></div>;
};

export default TopSingerWordCloud;
