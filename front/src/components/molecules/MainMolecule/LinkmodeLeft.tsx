import React from 'react';
import LinkmodeMaintext from '../../atoms/MainAtom/LinkmodeMaintext';
import LinkModeSubtext from '../../atoms/MainAtom/LinkModeSubtext';
import DisconnectButton from '../../atoms/MainAtom/DisconnectButton';

interface LinkmodeLeftProps {
  isConnected: boolean;
  selectedMode: string;
  onDisconnect: () => void;
}

const LinkmodeLeft = ({ isConnected, selectedMode, onDisconnect }: LinkmodeLeftProps) => {
  console.log('LinkmodeLeft received isConnected:', isConnected);

  return (
    <div className="flex flex-col justify-between">
      <div>
        <LinkmodeMaintext />
        <LinkModeSubtext isConnected={isConnected} selectedMode={selectedMode} />
      </div>
      {isConnected && <DisconnectButton onDisconnect={onDisconnect} />}
      {/* <DisconnectButton /> */}
    </div>
  );
};

export default LinkmodeLeft;
