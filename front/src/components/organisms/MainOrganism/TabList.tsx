import React from 'react';

type TabListProps = {
  activeTab: 'liked' | 'recent';
  setActiveTab: (tab: 'liked' | 'recent') => void;
};

const TabList = ({ activeTab, setActiveTab }: TabListProps) => {
  return (
    <div className="w-full h-[60px] flex border-b">
      <button
        className={`w-1/2 py-2 text-lg font-semibold transition-colors ${
          activeTab === 'liked' ? 'text-white border-b-2 border-purple-500' : 'text-gray-400'
        }`}
        onClick={() => setActiveTab('liked')}
      >
        찜한 곡
      </button>
      <button
        className={`w-1/2 py-2 text-lg font-semibold transition-colors ${
          activeTab === 'recent' ? 'text-white border-b-2 border-purple-500' : 'text-gray-400'
        }`}
        onClick={() => setActiveTab('recent')}
      >
        최근 부른 곡
      </button>
    </div>
  );
};

export default TabList;
