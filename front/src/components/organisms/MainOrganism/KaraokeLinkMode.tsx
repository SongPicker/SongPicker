import React from 'react';
import { useNavigate } from 'react-router-dom';
import LinkmodeLeft from '../../molecules/MainMolecule/LinkmodeLeft';
import LinkmodeCircle from '../../atoms/MainAtom/LinkmodeCircle';

interface KaraokeLinkModeProps {
  isConnected: boolean;
  mode: string | null;
  teamName: string | null;
  onDisconnect: () => void;
  onLinkmodeClick: () => void;
}

const KaraokeLinkMode = ({
  isConnected,
  mode,
  teamName,
  onDisconnect,
  onLinkmodeClick,
}: KaraokeLinkModeProps) => {
  return (
    <div
      className="relative flex justify-between w-full min-w-[320px] h-[150px] ms-auto p-[3px] rounded-2xl"
      style={{ background: 'linear-gradient(to bottom, #D34ADE, #5B2B99)' }}
    >
      <div className="flex justify-between w-full h-full bg-black rounded-2xl p-4">
        <LinkmodeLeft
          isConnected={isConnected}
          mode={mode}
          teamName={teamName}
          onDisconnect={onDisconnect}
        />
        <div className="self-center ms-2">
          <LinkmodeCircle isConnected={isConnected} onClick={onLinkmodeClick} />
        </div>
      </div>
    </div>
  );
};

export default KaraokeLinkMode;
