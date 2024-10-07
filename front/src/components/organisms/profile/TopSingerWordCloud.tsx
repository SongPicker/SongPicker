import { useCallback } from 'react';
import WordCloud from 'react-d3-cloud';

type TopSingerWordCloudProps = {
  topSingerList: {
    text: string;
    value: number;
  }[];
};

const TopSingerWordCloud = (props: TopSingerWordCloudProps) => {
  const fontSizeMapper = useCallback(
    (word: { value: number }) => Math.log2(word.value + 1) * 20,
    []
  );
  const rotate = useCallback(() => Math.floor(Math.random() * 31) - 15, []);

  return (
    <div className="w-full h-fit bg-white rounded-xl">
      <WordCloud
        data={props.topSingerList}
        width={500}
        height={320}
        font="pretendard"
        fontSize={fontSizeMapper}
        padding={3}
        rotate={rotate}
      />
    </div>
  );
};

export default TopSingerWordCloud;
