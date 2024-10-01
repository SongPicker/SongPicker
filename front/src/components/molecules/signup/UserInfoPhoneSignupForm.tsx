import React, { useState, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';
import SignupInput from '../../atoms/signup/SignupInput';
import SignupButton from '../../atoms/signup/SignupButton';
import useAuthStore from '../../../stores/useAuthStore';

type UserInfoPhoneSignupFormProps = {
  onVerify: () => void;
  onResetAuthCode: () => void;
  onChange: (phone: string) => void;
  onValidation: (isValid: boolean) => void;
  showLabel?: boolean;
  purpose?: 'SIGNUP' | 'FIND_PASSWORD' | 'CHANGE_PHONE' | 'FIND_LOGIN_ID';
};

const UserInfoPhoneSignupForm = ({
  onVerify,
  onResetAuthCode,
  onChange,
  onValidation,
  showLabel = true,
  purpose = 'SIGNUP',
}: UserInfoPhoneSignupFormProps) => {
  const [phone, setPhone] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isPhoneAvailable, setIsPhoneAvailable] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [message, setMessage] = useState('');
  const [showAuthCodeForm, setShowAuthCodeForm] = useState(false);

  const checkPhoneAvailability = useAuthStore(state => state.checkPhoneAvailability);
  const sendPhoneVerification = useAuthStore(state => state.sendPhoneVerification);

  const debouncedCheckAvailability = useCallback(
    debounce(async (phoneNumber: string) => {
      if (phoneNumber.length === 11) {
        setIsChecking(true);
        console.log('Checking phone availability:', phoneNumber);
        try {
          const { isAvailable, message } = await checkPhoneAvailability(phoneNumber);
          console.log('Phone availability result:', isAvailable, message);
          setIsPhoneAvailable(isAvailable);
          setMessage(message);
          onValidation(isAvailable);
        } finally {
          setIsChecking(false);
        }
      }
    }, 300),
    [checkPhoneAvailability, onValidation]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^0-9]/g, '');
      setPhone(value);
      onChange(value);
      setIsPhoneValid(value.length === 11);
      if (value.length === 11) {
        debouncedCheckAvailability(value);
      } else {
        setIsPhoneAvailable(false);
        onValidation(false);
        setMessage('');
      }
    },
    [onChange, debouncedCheckAvailability, onValidation]
  );

  const handleVerify = useCallback(async () => {
    if (isPhoneValid && isPhoneAvailable) {
      console.log('Sending phone verification:', phone);
      const { isSuccess, message } = await sendPhoneVerification(phone, purpose);
      console.log('Phone verification send result:', isSuccess, message);
      if (isSuccess) {
        setShowAuthCodeForm(true);
        onVerify();
      }
      setMessage(message);
    }
  }, [isPhoneValid, isPhoneAvailable, phone, sendPhoneVerification, purpose, onVerify]);

  const handleRetry = useCallback(() => {
    setShowAuthCodeForm(false);
    setPhone('');
    setIsPhoneValid(false);
    setIsPhoneAvailable(false);
    setMessage('');
    onResetAuthCode();
  }, [onResetAuthCode]);

  return (
    <div className="h-24">
      {showLabel && (
        <label htmlFor="phone" className="block text-lg text-white mb-2">
          휴대폰 번호
        </label>
      )}
      <div className="flex items-center">
        <SignupInput
          id="phone"
          name="phone"
          type="tel"
          placeholder="휴대폰 번호를 입력해주세요"
          value={phone}
          onChange={handleChange}
          className="flex-grow"
          maxLength={11}
          disabled={showAuthCodeForm}
        />
        <div className="ml-[18px]">
          {!showAuthCodeForm && (
            <SignupButton
              disabled={!isPhoneValid || !isPhoneAvailable || isChecking}
              onClick={handleVerify}
            >
              인증하기
            </SignupButton>
          )}
          {showAuthCodeForm && <SignupButton onClick={handleRetry}>다시 받기</SignupButton>}
        </div>
      </div>
      <div className="h-6 mt-1">
        {isChecking && (
          <ul className="list-disc list-inside text-yellow-500 text-sm">
            <li>확인 중...</li>
          </ul>
        )}
        {!isChecking && message && (
          <ul className="list-disc list-inside text-sm">
            <li className={isPhoneAvailable ? 'text-green-500' : 'text-red-500'}>{message}</li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserInfoPhoneSignupForm;
