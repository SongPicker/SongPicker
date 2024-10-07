import React, { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import SignupInput from '../../atoms/signup/SignupInput';
import SignupButton from '../../atoms/signup/SignupButton';
import useAuthStore from '../../../stores/useAuthStore';

type Purpose = 'SIGNUP' | 'FIND_PASSWORD' | 'CHANGE_PHONE' | 'FIND_LOGIN_ID';

type UserInfoPhoneSignupFormProps = {
  onVerify: () => void;
  onResetAuthCode: () => void;
  onChange: (phone: string) => void;
  onValidation: (isValid: boolean) => void;
  showLabel?: boolean;
  purpose: Purpose;
  checkAvailability?: boolean;
  loginId?: string;
  onError?: (message: string) => void; // 선택적 prop으로 변경
};

const UserInfoPhoneSignupForm: React.FC<UserInfoPhoneSignupFormProps> = ({
  onVerify,
  onResetAuthCode,
  onChange,
  onValidation,
  showLabel = true,
  purpose,
  checkAvailability = true,
  loginId,
  onError,
}) => {
  const [phone, setPhone] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isPhoneAvailable, setIsPhoneAvailable] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [message, setMessage] = useState('');
  const [showAuthCodeForm, setShowAuthCodeForm] = useState(false);

  const sendPhoneVerification = useAuthStore(state => state.sendPhoneVerification);
  const checkPhoneAvailability = useAuthStore(state => state.checkPhoneAvailability);

  const debouncedCheckAvailability = useCallback(
    debounce(async (phoneNumber: string) => {
      if (phoneNumber.length === 11 && checkAvailability) {
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
      } else if (phoneNumber.length === 11) {
        // If not checking availability, consider the phone number valid if it's the correct length
        setIsPhoneAvailable(true);
        onValidation(true);
      }
    }, 300),
    [checkPhoneAvailability, onValidation, checkAvailability]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^0-9]/g, '');
      setPhone(value);
      onChange(value);
      const phoneValid = value.length === 11;
      setIsPhoneValid(phoneValid);
      if (phoneValid) {
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
    if (isPhoneValid && (isPhoneAvailable || !checkAvailability)) {
      console.log('Sending phone verification:', phone);
      const result = await sendPhoneVerification(phone, purpose, loginId);
      console.log('Phone verification send result:', result.isSuccess, result.message);

      if (result.isSuccess) {
        setShowAuthCodeForm(true);
        onVerify();
      } else {
        // 모든 오류 상황에 대해 onError 호출
        if (onError) {
          onError(result.message);
        }
        setMessage(result.message);
      }
    }
  }, [
    isPhoneValid,
    isPhoneAvailable,
    phone,
    sendPhoneVerification,
    purpose,
    onVerify,
    checkAvailability,
    loginId,
    onError,
  ]);

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
              disabled={!isPhoneValid || (!isPhoneAvailable && checkAvailability) || isChecking}
              onClick={handleVerify}
            >
              인증하기
            </SignupButton>
          )}
          {showAuthCodeForm && <SignupButton onClick={handleRetry}>다시 받기</SignupButton>}
        </div>
      </div>
      <div className="h-6 mt-1">
        {isChecking && checkAvailability && (
          <ul className="list-disc list-inside text-yellow-500 text-sm">
            <li>확인 중...</li>
          </ul>
        )}
        {!isChecking && message && checkAvailability && (
          <ul className="list-disc list-inside text-sm">
            <li className={isPhoneAvailable ? 'text-green-500' : 'text-red-500'}>{message}</li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserInfoPhoneSignupForm;
