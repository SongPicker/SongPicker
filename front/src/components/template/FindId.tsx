import React, { useState, useCallback } from 'react';
import UserInfoPhoneSignupForm from '../molecules/signup/UserInfoPhoneSignupForm';
import UserInfoAuthCodeSignupForm from '../molecules/signup/UserInfoAuthCodeSignupForm';

type Props = {
  onVerificationComplete: (isComplete: boolean) => void;
};

const FindId = ({ onVerificationComplete }: Props) => {
  const [phone, setPhone] = useState('');
  const [showAuthCode, setShowAuthCode] = useState(false);
  const [resetAuthCode, setResetAuthCode] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  const handlePhoneChange = useCallback((value: string) => {
    setPhone(value);
  }, []);

  const handlePhoneVerify = useCallback(() => {
    console.log('Sending verification code to:', phone);
    setShowAuthCode(true);
    setResetAuthCode(false);
    onVerificationComplete(false);
  }, [phone, onVerificationComplete]);

  const handleResetAuthCode = useCallback(() => {
    setResetAuthCode(true);
    onVerificationComplete(false);
    console.log('Resending verification code to:', phone);
  }, [phone, onVerificationComplete]);

  const handleAuthCodeVerify = useCallback(() => {
    console.log('Verifying auth code');
    onVerificationComplete(true);
  }, [onVerificationComplete]);

  const handlePhoneValidation = useCallback((isValid: boolean) => {
    setIsPhoneValid(isValid);
  }, []);

  return (
    <div className="mt-4">
      <div className="text-xl mb-6 font-semibold">
        아이디를 찾기 위해
        <br /> 휴대폰 번호를 인증해주세요.
      </div>
      <UserInfoPhoneSignupForm
        onVerify={handlePhoneVerify}
        onResetAuthCode={handleResetAuthCode}
        onChange={handlePhoneChange}
        onValidation={handlePhoneValidation}
        showLabel={false}
        purpose="FIND_LOGIN_ID"
      />
      {showAuthCode && (
        <UserInfoAuthCodeSignupForm
          onVerify={handleAuthCodeVerify}
          resetAuthCode={resetAuthCode}
          phone={phone}
          purpose="FIND_LOGIN_ID"
        />
      )}
    </div>
  );
};

export default FindId;
