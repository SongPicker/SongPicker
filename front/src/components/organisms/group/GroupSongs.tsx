import React, { useState } from 'react';

const GroupSongs = () => {
  const [activeTab, setActiveTab] = useState<'recommended' | 'recent'>('recommended');

  return (
    <div className="mt-4">
      <div className="flex justify-around mb-4">
        <button
          className={`px-4 py-2 ${activeTab === 'recommended' ? 'text-primary border-b-2 border-primary' : ''}`}
          onClick={() => setActiveTab('recommended')}
        >
          추천곡
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'recent' ? 'text-primary border-b-2 border-primary' : ''}`}
          onClick={() => setActiveTab('recent')}
        >
          최근 부른 곡
        </button>
      </div>
      <div className="h-64 overflow-y-auto">
        {activeTab === 'recommended' ? (
          <div>
            {/* 추천곡 리스트 */}
            <p>추천곡 리스트가 여기에 표시됩니다.</p>
          </div>
        ) : (
          <div>
            {/* 최근 부른 곡 리스트 */}
            <p>최근 부른 곡 리스트가 여기에 표시됩니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupSongs;
