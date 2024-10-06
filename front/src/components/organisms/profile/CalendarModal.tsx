import MusicItem from '../commons/MusicItem';
import xButton from '../../../assets/xButton.svg';
import { useEffect, useState } from 'react';
import { getSongList } from '../../../services/profileService';

type CalendarModalProps = {
  selectedYear: number;
  selectedMonth: number;
  selectedDate: number;
  handleModal: () => void;
};

type Song = {
  likeId: string;
  number: string;
  title: string;
  singer: string;
  coverImage: string;
  isLike: boolean;
  // onLikeToggle: () => void;
  // onShowConnectionModal: (message: string) => void;
  // onItemClick: (music: { id: string; title: string; artist: string; imageUrl: string }) => void;
  // isConnected: boolean;
};

const CalendarModal = (props: CalendarModalProps) => {
  const [selectedSongList, setSelectedSongList] = useState<Song[]>([]);
  useEffect(() => {
    const fetchSongList = async () => {
      try {
        const songList = await getSongList(
          props.selectedYear,
          props.selectedMonth,
          props.selectedDate
        );
        setSelectedSongList(songList);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSongList();
  }, [props.selectedYear, props.selectedMonth, props.selectedDate]);

  return (
    <div className="modal modal-open">
      <div className="modal-box modal-scroll h-5/6 space-y-5 bg-gradient-to-b from-[#9747ff] to-[#565ed2] text-white">
        <div className="p-1 flex w-full justify-between items-center">
          <p className="font-bold text-lg">
            {props.selectedYear}년 {props.selectedMonth}월 {props.selectedDate}일에는 n곡을
            불렀어요!
          </p>
          <div
            className="flex border-none cursor-pointer"
            onClick={() => {
              props.handleModal();
            }}
          >
            <img src={xButton} />
          </div>
        </div>
        <div className="border border-[#cccccc]"></div>
        <div className="space-y-1">
          {selectedSongList.map((item, i) => {
            return (
              <MusicItem
                number={item.number}
                title={item.title}
                artist={item.singer}
                imageUrl={item.coverImage}
                isLiked={item.isLike}
                id={item.likeId}
                onLikeToggle={() => {
                  console.log('좋아요');
                }}
                onShowConnectionModal={() => {
                  console.log('모달');
                }}
                onItemClick={() => {
                  console.log('클릭');
                }}
                isConnected={true}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;
