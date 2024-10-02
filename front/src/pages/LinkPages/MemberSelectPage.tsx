import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SubTopNavbar from '../../components/molecules/commons/SubTopNavbar';
import MemberSelectList from '../../components/template/Maintemplate/MemberSelectList';
import FooterButton from '../../components/atoms/commons/FooterButton';

const MemberSelectPage = () => {
  const [selectedMode, setSelectedMode] = useState<string>('');
  const navigate = useNavigate();

  const handleNext = () => {
    if (selectedMode === '그룹 모드') {
      navigate('/group-select');
    } else {
      navigate('/qr-scan', { state: { mode: selectedMode } });
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <SubTopNavbar title="노래방 모드 선택" />
      <MemberSelectList selectedMode={selectedMode} setSelectedMode={setSelectedMode} />
      <FooterButton onClick={handleNext} isValid={selectedMode !== ''}>
        다음
      </FooterButton>
    </div>
  );
};

export default MemberSelectPage;
