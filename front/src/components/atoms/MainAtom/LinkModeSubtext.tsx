import React from 'react';

interface LinkModeSubtextProps {
  isConnected: boolean;
  mode: string | null;
  teamName: string | null;
}

const LinkModeSubtext = ({ isConnected, mode, teamName }: LinkModeSubtextProps) => {
  if (!isConnected) {
    return (
      <>
        <p>연결모드 이용전</p>
      </>
    );
  }

  if (mode === 'INDIVIDUAL') {
    return (
      <p>
        <span className="text-[#9747FF] mr-1 font-semibold">개인모드</span>이용중
      </p>
    );
  }

  if (mode === 'TEAM' && teamName) {
    return (
      <>
        <div className="flex">
          <p>
            <span className="text-[#9747FF] mr-1 font-semibold">{teamName}</span>
            그룹 이용중
          </p>
        </div>
      </>
    );
  }

  return null; // 기본적으로 렌더링할 내용이 없는 경우
};

export default LinkModeSubtext;
