import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import SignupInput from '../../atoms/signup/SignupInput';
import useAuthStore from '../../../stores/useAuthStore';

type UserInfoNicknameSignupFormProps = {
  initialNickname?: string;
  onChange: (nickname: string) => void;
  onValidation: (isValid: boolean) => void;
  isEditMode?: boolean;
  onSave?: () => void;
};

const UserInfoNicknameSignupForm = ({
  initialNickname = '',
  onChange,
  onValidation,
  isEditMode = false,
  onSave,
}: UserInfoNicknameSignupFormProps) => {
  const [nickname, setNickname] = useState(initialNickname);
  const [isLengthValid, setIsLengthValid] = useState(false);
  const [isContentValid, setIsContentValid] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [message, setMessage] = useState('');
  const [hasEdited, setHasEdited] = useState(false);

  const checkNicknameAvailability = useAuthStore(state => state.checkNicknameAvailability);

  const validateNickname = useCallback((value: string) => {
    const lengthValid = value.length >= 2 && value.length <= 8;
    const contentValid = /^(?:[a-zA-Z]{2,8}|[가-힣]{2,8}|[a-zA-Z0-9가-힣]{2,8})$/.test(value);
    return { lengthValid, contentValid };
  }, []);

  const debouncedCheckAvailability = useCallback(
    debounce(async (value: string) => {
      const { lengthValid, contentValid } = validateNickname(value);
      if (lengthValid && contentValid && (!isEditMode || value !== initialNickname)) {
        setIsChecking(true);
        try {
          const { isAvailable, message } = await checkNicknameAvailability(value);
          setIsAvailable(isAvailable);
          setMessage(message);
          onValidation(isAvailable);
        } finally {
          setIsChecking(false);
        }
      }
    }, 300),
    [validateNickname, checkNicknameAvailability, onValidation, initialNickname, isEditMode]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setNickname(value);
      onChange(value);
      setHasEdited(value !== initialNickname);

      const { lengthValid, contentValid } = validateNickname(value);
      setIsLengthValid(lengthValid);
      setIsContentValid(contentValid);

      if (lengthValid && contentValid) {
        debouncedCheckAvailability(value);
      } else {
        setIsAvailable(false);
        onValidation(false);
        setMessage('');
      }
    },
    [onChange, debouncedCheckAvailability, initialNickname, validateNickname]
  );

  useEffect(() => {
    if (isEditMode) {
      const { lengthValid, contentValid } = validateNickname(initialNickname);
      setIsLengthValid(lengthValid);
      setIsContentValid(contentValid);
      setIsAvailable(true);
      setMessage('');
    }
  }, [isEditMode, initialNickname, validateNickname]);

  return (
    <div className="h-24">
      <label htmlFor="nickname" className="block text-lg text-white mb-2">
        닉네임
      </label>
      <div className="flex gap-4">
        <SignupInput
          id="nickname"
          name="nickname"
          type="text"
          placeholder={
            isEditMode && nickname.length > 0 ? initialNickname : '닉네임을 입력해주세요'
          }
          value={nickname}
          onChange={handleChange}
          maxLength={8}
        />
        {isEditMode && (
          <button
            className={`h-fit px-5 py-2 rounded-md text-sm text-white transition-colors whitespace-nowrap disabled:bg-[#AAAAAA] disabled:cursor-not-allowed border-none shadow-lg bg-primary hover:bg-secondary`}
            type="button"
            onClick={onSave}
            disabled={!isAvailable || !hasEdited || !isLengthValid || !isContentValid}
          >
            저장
          </button>
        )}
      </div>
      <div className="h-6 mt-1">
        {isChecking && (
          <ul className="list-disc list-inside text-yellow-500 text-sm">
            <li>확인 중...</li>
          </ul>
        )}
        {!isChecking && message && (
          <ul className="list-disc list-inside text-sm">
            <li className={isAvailable ? 'text-green-500' : 'text-red-500'}>{message}</li>
          </ul>
        )}
        {!isChecking && !isLengthValid && nickname.length > 0 && (
          <ul className="list-disc list-inside text-red-500 text-sm">
            <li>닉네임은 2~8자 사이여야 합니다.</li>
          </ul>
        )}
        {!isChecking && !isContentValid && nickname.length > 0 && (
          <ul className="list-disc list-inside text-red-500 text-sm">
            <li>영문, 한글, 숫자만 사용 가능합니다.</li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserInfoNicknameSignupForm;
