import React, { useState, useEffect } from 'react';
import BasicInput from '../../atoms/signup/SignupInput';
import PasswordVisibilityToggle from '../../atoms/commons/PasswordVisibilityToggle';

type BasicInfoPasswordConfirmFormProps = {
  password: string;
  passwordConfirm: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValidation: (isValid: boolean) => void;
  label?: string;
  placeholder?: string;
  name?: string;
};

const BasicInfoPasswordConfirmForm = ({
  password,
  passwordConfirm,
  onChange,
  onValidation,
  label = '비밀번호 확인',
  placeholder = '비밀번호를 다시 입력해주세요',
  name = 'passwordConfirm',
}: BasicInfoPasswordConfirmFormProps) => {
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const valid = password === passwordConfirm;
    setError(valid ? '' : '비밀번호가 일치하지 않습니다.');
    onValidation(valid);
  }, [password, passwordConfirm, onValidation]);

  return (
    <div className="relative h-24">
      <label htmlFor={name} className="block text-lg text-white mb-2">
        {label}
      </label>
      <div className="relative">
        <BasicInput
          id={name}
          type={showPasswordConfirm ? 'text' : 'password'}
          placeholder={placeholder}
          value={passwordConfirm}
          name={name}
          onChange={onChange}
          className="w-full pr-10"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <PasswordVisibilityToggle
            showPassword={showPasswordConfirm}
            onToggle={() => setShowPasswordConfirm(!showPasswordConfirm)}
          />
        </div>
      </div>
      <div className="h-6 mt-1">
        {error && (
          <ul className="list-disc list-inside text-sm mt-2 space-y-1">
            <li className="text-red-500 text-sm">{error}</li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default BasicInfoPasswordConfirmForm;
