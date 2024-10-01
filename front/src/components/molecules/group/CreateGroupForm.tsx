import React, { useState } from 'react';
import GroupImageUpload from '../../atoms/group/GroupImageUpload';
import GroupNameInput from '../../atoms/group/GroupNameInput';

interface CreateGroupFormProps {
  groupName: string;
  groupImage: File | null;
  onNameChange: (name: string) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onValidation: (isValid: boolean) => void;
}

const CreateGroupForm = ({
  groupName,
  groupImage,
  onNameChange,
  onImageChange,
  onSubmit,
  onValidation,
}: CreateGroupFormProps) => {
  const [isGroupNameValid, setIsGroupNameValid] = useState(false);

  const handleGroupNameValidation = (isValid: boolean) => {
    setIsGroupNameValid(isValid);
    onValidation(isValid);
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <GroupImageUpload groupImage={groupImage} onImageChange={onImageChange} />
      <GroupNameInput
        groupName={groupName}
        onNameChange={onNameChange}
        onValidation={handleGroupNameValidation}
      />
      <button
        onClick={onSubmit}
        className={`w-full py-3 rounded-md transition-colors ${
          isGroupNameValid
            ? 'bg-primary text-white hover:bg-purple-700'
            : 'bg-gray-500 text-gray-300 cursor-not-allowed'
        }`}
        disabled={!isGroupNameValid}
      >
        그룹 생성
      </button>
    </div>
  );
};

export default CreateGroupForm;
