import React, { useEffect, useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import PlayListIcon from '../../atoms/commons/PlayListIcon';
import TabList from '../../organisms/MainOrganism/TabList';
import RecentSongList from '../../organisms/commons/RecentSongList';
import LikedSongList from '../../organisms/commons/LikedSongList';

type PlayListModalProps = {
  closeModal: () => void;
};

const PlayListModal = ({ closeModal }: PlayListModalProps) => {
  const [activeTab, setActiveTab] = useState<'liked' | 'recent'>('liked');

  useEffect(() => {
    // 브라우저의 히스토리에 가짜 상태를 추가
    window.history.pushState(null, '', window.location.href);

    // 뒤로가기 이벤트 핸들러
    const handlePopState = () => {
      closeModal();
    };

    // 뒤로가기 이벤트 리스너 추가
    window.addEventListener('popstate', handlePopState);

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [closeModal]);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-[9998]">
      <div className="mx-auto w-screen max-w-[640px]  bg-[#333] text-white px-2 pb-4 rounded-b-sm shadow-lg transition-transform transform translate-y-0">
        <div className="flex flex-col h-[75vh] w-full">
          {/* 상단 제목 */}
          <div className="flex gap-2 items-center w-full h-[60px]">
            <PlayListIcon />
            <h4 className="text-lg font-semibold">마이리스트</h4>
          </div>

          {/* 탭 */}
          <TabList activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* 노래리스트 */}
          <div className="w-full px-1 mt-3 overflow-y-scroll h-[calc(100%-120px)]">
            {activeTab === 'liked' ? <LikedSongList /> : <RecentSongList />}
          </div>
        </div>
      </div>
      <button
        onClick={closeModal}
        className="mx-auto mt-2 text-lg size-10 bg-[#FF8388] rounded-full flex items-center justify-center"
      >
        <RiCloseFill />
      </button>
    </div>
  );
};

export default PlayListModal;
