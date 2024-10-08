import React, { useState, useEffect } from 'react';
import BasicInput from '../../atoms/signup/SignupInput';
import PasswordVisibilityToggle from '../../atoms/commons/PasswordVisibilityToggle';

type BasicInfoPasswordFormProps = {
  password: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValidation: (isValid: boolean) => void;
  label?: string;
  placeholder?: string;
  name?: string;
};

const BasicInfoPasswordForm = ({
  password,
  onChange,
  onValidation,
  label = '비밀번호',
  placeholder = '비밀번호를 입력해주세요',
  name = 'password',
}: BasicInfoPasswordFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLengthValid, setIsLengthValid] = useState(false);
  const [isContentValid, setIsContentValid] = useState(false);

  useEffect(() => {
    const lengthValid = password.length >= 8 && password.length <= 16;
    const contentValid = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])/.test(password);

    setIsLengthValid(lengthValid);
    setIsContentValid(contentValid);

    onValidation(lengthValid && contentValid);
  }, [password, onValidation]);

  const allValid = isLengthValid && isContentValid;

  return (
    <div className="relative h-24">
      <label htmlFor={name} className="block text-lg text-white mb-2">
        {label}
      </label>
      <div className="relative">
        <BasicInput
          id={name}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={password}
          name={name}
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

      {password.length > 0 && !allValid && (
        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
          <li className={isLengthValid ? 'text-green-500' : 'text-red-500'}>최소 8자, 최대 16자</li>
          <li className={isContentValid ? 'text-green-500' : 'text-red-500'}>
            하나 이상의 영문자, 숫자 및 특수문자 포함
          </li>
        </ul>
      )}
      {allValid && (
        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
          <li className="text-green-500 text-sm mt-2">올바른 비밀번호 형식입니다.</li>
        </ul>
      )}
    </div>
  );
};

export default BasicInfoPasswordForm;
