import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

interface GroupNameInputProps {
  groupName: string;
  onNameChange: (name: string) => void;
  onValidation: (isValid: boolean) => void;
}

const GroupNameInput = ({ groupName, onNameChange, onValidation }: GroupNameInputProps) => {
  const [isLengthValid, setIsLengthValid] = useState(false);
  const [isContentValid, setIsContentValid] = useState(false);

  const validateGroupName = useCallback(
    (value: string) => {
      const lengthValid = value.length >= 2 && value.length <= 8;
      const contentValid = /^(?:[a-zA-Z]{2,8}|[가-힣]{2,8}|[a-zA-Z0-9가-힣]{2,8})$/.test(value);

      setIsLengthValid(lengthValid);
      setIsContentValid(contentValid);

      onValidation(lengthValid && contentValid);
    },
    [onValidation]
  );

  const debouncedValidation = useCallback(debounce(validateGroupName, 300), [validateGroupName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 8); // 8글자로 제한
    onNameChange(value);
    debouncedValidation(value);
  };

  useEffect(() => {
    validateGroupName(groupName);
  }, [groupName, validateGroupName]);

  return (
    <div className="mb-6 w-full">
      <label htmlFor="groupName" className="block text-white mb-2">
        그룹 이름 <span className="text-red-500">*</span>
      </label>
      <div className="form-control w-full">
        <input
          type="text"
          id="groupName"
          value={groupName}
          onChange={handleChange}
          placeholder="그룹 이름을 입력해주세요"
          className="input w-full bg-transparent text-input-text placeholder-input-text border-0 border-b border-input-text focus:outline-none focus:border-primary rounded-none px-0 py-2"
        />
      </div>
      <div className="mt-1">
        <ul className="list-disc list-inside text-sm">
          <li className={isLengthValid ? 'text-green-500' : 'text-red-500'}>
            그룹 이름은 2~8자 사이여야 합니다.
          </li>
          <li className={isContentValid ? 'text-green-500' : 'text-red-500'}>
            영문, 한글, 숫자만 사용 가능합니다.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default GroupNameInput;
