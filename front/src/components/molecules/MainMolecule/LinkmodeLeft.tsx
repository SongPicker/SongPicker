import React from 'react';
import LinkmodeMaintext from '../../atoms/MainAtom/LinkmodeMaintext';
import LinkModeSubtext from '../../atoms/MainAtom/LinkModeSubtext';
import DisconnectButton from '../../atoms/MainAtom/DisconnectButton';

const LinkmodeLeft = ({ isConnected }: { isConnected: boolean }) => {
  console.log('LinkmodeLeft received isConnected:', isConnected);

  return (
    <div className="flex flex-col justify-between">
      <div>
        <LinkmodeMaintext />
        <LinkModeSubtext />
      </div>
      {isConnected && <DisconnectButton />}
      <DisconnectButton />
    </div>
  );
};

export default LinkmodeLeft;
