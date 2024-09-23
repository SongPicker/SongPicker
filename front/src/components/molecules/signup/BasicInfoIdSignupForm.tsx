import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import SignupInput from '../../atoms/signup/SignupInput';
import useAuthStore from '../../../stores/useAuthStore';

type BasicInfoIdFormProps = {
  loginId: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValidation: (isValid: boolean, isAvailable: boolean) => void;
};

const validateId = (id: string) => {
  const regex = /^[a-z0-9]{4,16}$/;
  return regex.test(id);
};

const BasicInfoIdForm = ({ loginId, onChange, onValidation }: BasicInfoIdFormProps) => {
  const [isIdValid, setIsIdValid] = useState(false);
  const [isIdAvailable, setIsIdAvailable] = useState(false);
  const [message, setMessage] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const checkLoginIdAvailability = useAuthStore(state => state.checkLoginIdAvailability);

  const debouncedCheckAvailability = useCallback(
    debounce(async (id: string) => {
      if (validateId(id)) {
        setIsChecking(true);
        console.log('Checking login ID availability:', id);
        try {
          const { isAvailable, message } = await checkLoginIdAvailability(id);
          console.log('Login ID availability result:', isAvailable, message);
          setIsIdAvailable(isAvailable);
          setMessage(message);
          onValidation(true, isAvailable);
        } finally {
          setIsChecking(false);
        }
      }
    }, 300),
    [checkLoginIdAvailability, onValidation]
  );

  useEffect(() => {
    const valid = validateId(loginId);
    setIsIdValid(valid);
    if (valid) {
      debouncedCheckAvailability(loginId);
    } else {
      setIsIdAvailable(false);
      onValidation(false, false);
      setMessage('');
    }
  }, [loginId, debouncedCheckAvailability, onValidation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    setIsChecking(true);
  };

  return (
    <div className="h-24">
      <label htmlFor="loginId" className="block text-lg text-white mb-2">
        아이디
      </label>
      <SignupInput
        id="loginId"
        type="text"
        placeholder="아이디를 입력해주세요"
        value={loginId}
        name="loginId"
        onChange={handleChange}
        className="w-full"
      />
      <div className="h-6 mt-1">
        {isChecking && (
          <ul className="list-disc list-inside text-yellow-500 text-sm">
            <li>확인 중...</li>
          </ul>
        )}
        {!isChecking && message && (
          <ul className="list-disc list-inside text-sm">
            <li className={isIdAvailable ? 'text-green-500' : 'text-red-500'}>{message}</li>
          </ul>
        )}
        {!isChecking && !isIdValid && loginId && (
          <ul className="list-disc list-inside text-sm text-red-500">
            <li>4~16자의 영문 소문자, 숫자만 사용 가능합니다.</li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default BasicInfoIdForm;
