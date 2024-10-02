import React from 'react';

interface LinkModeSubtextProps {
  isConnected: boolean;
  selectedMode: string;
}

const LinkModeSubtext = ({ isConnected, selectedMode }: LinkModeSubtextProps) => {
  const getSubtext = () => {
    if (!isConnected) return '연결하고 더 많은 서비스를 이용해보세요 ';
    return `${selectedMode} 이용중`;
  };

  return <div>{getSubtext()}</div>;
};

export default LinkModeSubtext;
