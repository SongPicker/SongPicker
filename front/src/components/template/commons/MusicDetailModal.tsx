import React from 'react';
import BottomSlideModal from './BottomSlideModal';
import { SongDetail } from '../../../services/songservices';

interface MusicDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  songDetail: SongDetail;
  isLoading: boolean;
  height?: string;
}

const MusicDetailModal = ({
  isOpen,
  onClose,
  songDetail,
  isLoading,
  height,
}: MusicDetailModalProps) => {
  console.log('MusicDetailModal rendered:', { isOpen, songDetail, isLoading });
  if (isLoading) {
    return (
      <BottomSlideModal isOpen={isOpen} onClose={onClose} height={height} title={songDetail.title}>
        <div className="flex justify-center items-center h-full">
          <p>로딩 중...</p>
        </div>
      </BottomSlideModal>
    );
  }

  return (
    <BottomSlideModal isOpen={isOpen} onClose={onClose} height={height} title={songDetail.title}>
      <div className="px-2 py-3">
        {/* 디테일 상단 */}
        <div className="flex justify-between items-start mb-6">
          {/* 앨범 */}
          <div className="me-4 w-[33%] min-w-[110px] max-w-[140px] aspect-square rounded overflow-hidden mx-auto">
            <img src={songDetail.coverImage} alt={`${songDetail.title} 앨범 이미지`} />
          </div>
          {/* 곡정보 */}
          <div className="w-[60%]">
            {/* 곡번호 */}
            <div className="flex mb-1">
              <p className="w-[80px] font-semibold">곡 번호</p>
              <p className="font-medium text-[#9747FF]">{songDetail.number}</p>
            </div>
            {/* 곡번호 */}
            <div className="flex mb-1">
              <p className="w-[80px] font-semibold whitespace-break-spaces">아티스트</p>
              <p className="font-medium w-[calc(100%-85px)]">{songDetail.singer}</p>
            </div>
            {/* 곡번호 */}
            <div className="flex mb-1">
              <p className="w-[80px] font-semibold">장르</p>
              <p className="font-medium">{songDetail.genre}</p>
            </div>
            {/* 곡번호 */}
            <div className="flex">
              <p className="w-[80px] font-semibold">발매</p>
              <p className="font-medium">{songDetail.releasedAt}</p>
            </div>
          </div>
        </div>

        {/* 가사 */}
        <div className="border-t py-3 text-center">
          <p className="font-bold text-lg mb-4">가사 정보</p>
          <div className="max-w-[65%] mx-auto whitespace-pre-line leading-3">
            {songDetail.lyrics}
          </div>
        </div>
      </div>
    </BottomSlideModal>
  );
};

export default MusicDetailModal;
