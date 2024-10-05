import React, { useState } from 'react';
import RecommendedSongs from '../../molecules/group/RecommendedSongs';
import RecentSongs from '../../molecules/group/RecentSongs';

interface GroupSongsProps {
  teamId: number;
  teamName: string;
  isConnected: boolean;
  onShowConnectionModal: (
    message: string,
    icon: 'link' | 'spinner' | 'reservation',
    delay?: number
  ) => void;
}

const GroupSongs: React.FC<GroupSongsProps> = ({
  teamId,
  teamName,
  isConnected,
  onShowConnectionModal,
}) => {
  const [activeTab, setActiveTab] = useState<'recommended' | 'recent'>('recommended');

  return (
    <div
      className="flex flex-col w-full h-full"
      style={{
        background: 'linear-gradient(to bottom, #452074, #000000, #575ED2)',
      }}
    >
      {/* 탭 버튼 */}
      <div
        className="flex justify-around mb-4 border-t border-primary"
        style={{ backgroundColor: 'transparent' }}
      >
        <button
          className={`w-1/2 py-2 text-lg font-semibold transition-colors ${
            activeTab === 'recommended'
              ? 'text-white border-r border-primary'
              : 'bg-gray-600 text-gray-400 border-b border-primary'
          }`}
          onClick={() => setActiveTab('recommended')}
        >
          추천곡
        </button>
        <button
          className={`w-1/2 py-2 text-lg font-semibold transition-colors ${
            activeTab === 'recent'
              ? 'text-white border-l border-primary'
              : 'bg-gray-600 text-gray-400 border-b border-primary'
          }`}
          onClick={() => setActiveTab('recent')}
        >
          최근 부른 곡
        </button>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="p-4" style={{ backgroundColor: 'transparent' }}>
        {activeTab === 'recommended' ? (
          <RecommendedSongs
            teamId={teamId}
            teamName={teamName}
            isConnected={isConnected}
            onShowConnectionModal={onShowConnectionModal}
          />
        ) : (
          <RecentSongs
            teamId={teamId}
            teamName={teamName}
            isConnected={isConnected}
            onShowConnectionModal={onShowConnectionModal}
          />
        )}
      </div>
    </div>
  );
};

export default GroupSongs;
