import React, { useState, useEffect, useCallback } from 'react';
import SignupInput from '../../atoms/signup/SignupInput';
import SignupButton from '../../atoms/signup/SignupButton';
import useAuthStore from '../../../stores/useAuthStore';

type UserInfoAuthCodeSignupFormProps = {
  onVerify: () => void;
  resetAuthCode: boolean;
  phone: string;
  purpose?: 'SIGNUP' | 'FIND_PASSWORD' | 'FIND_LOGIN_ID' | 'CHANGE_PHONE';
};

const UserInfoAuthCodeSignupForm = ({
  onVerify,
  resetAuthCode,
  phone,
  purpose = 'SIGNUP',
}: UserInfoAuthCodeSignupFormProps) => {
  const [authCode, setAuthCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(180);
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState('');

  const verifyPhoneCode = useAuthStore(state => state.verifyPhoneCode);
  const sendPhoneVerification = useAuthStore(state => state.sendPhoneVerification);

  useEffect(() => {
    if (resetAuthCode) {
      setAuthCode('');
      setIsVerified(false);
      setTimeLeft(180);
      setMessage('');
      sendPhoneVerification(phone, purpose);
    }
  }, [resetAuthCode, phone, sendPhoneVerification, purpose]);

  useEffect(() => {
    if (timeLeft > 0 && !isVerified) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft, isVerified]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthCode(e.target.value);
  };

  const handleVerify = useCallback(async () => {
    if (authCode.trim() !== '') {
      console.log('Verifying phone code:', authCode);
      const { isSuccess, message } = await verifyPhoneCode(authCode, phone);
      console.log('Phone code verification result:', isSuccess, message);
      if (isSuccess) {
        setIsVerified(true);
        onVerify();
      }
      setMessage(message);
    } else {
      setMessage('인증번호를 입력해주세요.');
    }
  }, [authCode, verifyPhoneCode, phone, onVerify]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="h-24">
      <label htmlFor="authCode" className="block text-lg text-white mb-2">
        인증번호
      </label>
      <div className="flex items-center">
        <SignupInput
          id="authCode"
          name="authCode"
          type="text"
          placeholder="인증번호를 입력해주세요"
          value={authCode}
          onChange={handleChange}
          className="flex-grow"
          disabled={isVerified || timeLeft === 0}
        />
        <div className="ml-[18px]">
          <SignupButton
            disabled={authCode.trim() === '' || isVerified || timeLeft === 0}
            onClick={handleVerify}
          >
            확인하기
          </SignupButton>
        </div>
      </div>
      <div className="h-6 mt-1">
        {!isVerified && timeLeft > 0 && (
          <ul className="list-disc list-inside text-yellow-500 text-sm">
            <li>남은 시간: {formatTime(timeLeft)}</li>
          </ul>
        )}
        {isVerified && (
          <ul className="list-disc list-inside text-green-500 text-sm">
            <li>{message}</li>
          </ul>
        )}
        {!isVerified && timeLeft === 0 && (
          <ul className="list-disc list-inside text-red-500 text-sm">
            <li>인증 시간이 만료되었습니다.</li>
          </ul>
        )}
        {!isVerified && message && (
          <ul className="list-disc list-inside text-red-500 text-sm">
            <li>{message}</li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserInfoAuthCodeSignupForm;
