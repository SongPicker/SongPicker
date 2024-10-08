import React, { useState, useEffect } from 'react';
import BasicInput from '../../atoms/signup/SignupInput';
import PasswordVisibilityToggle from '../../atoms/commons/PasswordVisibilityToggle';

type CurrentPasswordFormProps = {
  password: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const CurrentPasswordForm = ({ password, onChange }: CurrentPasswordFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

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
    </div>
  );
};

export default CurrentPasswordForm;
