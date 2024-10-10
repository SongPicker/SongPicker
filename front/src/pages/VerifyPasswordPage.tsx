import React, { useCallback, useState } from 'react';
import ExistPasswordForm from '../components/molecules/profile/ExistPasswordForm';
import { useNavigate, useParams } from 'react-router-dom';
import FooterButtonLayout from '../layouts/FooterButtonLayout';

const VerifyPasswordPage = () => {
  const navigate = useNavigate();
  const [existPassword, setExistPassword] = useState('');
  const [isExistPasswordValid, setIsExistPasswordValid] = useState(false);

  const handleExistPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setExistPassword(e.target.value);
  }, []);

  const handleExistPasswordValidation = useCallback((isValid: boolean) => {
    setIsExistPasswordValid(isValid);
  }, []);

  return (
    <FooterButtonLayout
      title="비밀번호 재설정"
      buttonText="다음"
      onButtonClick={() => {
        navigate('/members/change/change-password', { state: { existPassword: existPassword } });
      }}
      isButtonValid={isExistPasswordValid}
    >
      <div className="mt-12 px-4 space-y-12 min-w-72 w-full">
        {/* 현재 비밀번호 */}
        <ExistPasswordForm
          password={existPassword}
          onChange={handleExistPasswordChange}
          onValidation={handleExistPasswordValidation}
        />
      </div>
    </FooterButtonLayout>
  );
};

export default VerifyPasswordPage;
