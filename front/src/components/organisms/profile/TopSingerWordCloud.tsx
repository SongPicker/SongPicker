import { useCallback } from 'react';
import WordCloud from 'react-d3-cloud';
import { PiMicrophoneStageDuotone } from 'react-icons/pi';

type TopSingerWordCloudProps = {
  topSingerList: {
    text: string;
    value: number;
  }[];
};

const TopSingerWordCloud = ({ topSingerList }: TopSingerWordCloudProps) => {
  const fontSizeMapper = useCallback(
    (word: { value: number }) => Math.log2(word.value + 1) * 20,
    []
  );
  const rotate = useCallback(() => Math.floor(Math.random() * 31) - 15, []);

  if (topSingerList.length === 0) {
    return (
      <div className="w-full h-[320px] bg-[#fff] rounded-xl flex items-center justify-center flex-col">
        <PiMicrophoneStageDuotone className="size-10 text-purple-400 mb-4" />
        <div className="text-center text-purple-400 font-semibold">
          <p>아직 songpicker를 이용하지 않으셨군요!</p>
          <p>노래를 부르고 선호아티스트를 확인해보세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-fit bg-white rounded-xl">
      <WordCloud
        data={topSingerList}
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
