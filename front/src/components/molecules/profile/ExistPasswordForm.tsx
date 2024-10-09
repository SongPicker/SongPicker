import React, { useState, useEffect } from 'react';
import BasicInput from '../../atoms/signup/SignupInput';
import PasswordVisibilityToggle from '../../atoms/commons/PasswordVisibilityToggle';
import { verifyPassword } from '../../../services/profileChangeService';
import { debounce } from 'lodash';

type ExistPasswordFormProps = {
  password: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValidation: (isValid: boolean) => void;
};

const ExistPasswordForm = ({ password, onChange, onValidation }: ExistPasswordFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const checkPassword = async (existPassword: string) => {
    try {
      const code = await verifyPassword(existPassword);
      const isValid = code === 'AU103';
      onValidation(isValid);
      setError(isValid ? '' : '현재 비밀번호가 일치하지 않습니다.');
    } catch (error) {
      console.error('비밀번호 확인 오류:', error);
      setError('비밀번호 확인 중 오류가 발생했습니다.');
    }
  };

  const debouncedCheckPassword = debounce(checkPassword, 500);

  useEffect(() => {
    if (password) {
      debouncedCheckPassword(password);
    }
    return () => debouncedCheckPassword.cancel();
  }, [password, debouncedCheckPassword]);

  return (
    <div className="relative h-24">
      <label htmlFor="password" className="block text-lg text-white mb-2">
        현재 비밀번호
      </label>
      <div className="relative">
        <BasicInput
          id="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="현재 비밀번호를 입력해주세요"
          value={password}
          name="password"
          onChange={onChange}
          className="w-full pr-10"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <PasswordVisibilityToggle
            showPassword={showPassword}
            onToggle={() => setShowPassword(!showPassword)}
          />
        </div>
      </div>
      {error && (
        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
          <li className="text-red-500 text-sm mt-2">{error}</li>
        </ul>
      )}
    </div>
  );
};

export default ExistPasswordForm;
