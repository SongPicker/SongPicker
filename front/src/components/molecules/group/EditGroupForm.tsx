import React, { useState } from 'react';
import GroupImageUpload from '../../atoms/group/GroupImageUpload';
import GroupNameInput from '../../atoms/group/GroupNameInput';

interface EditGroupFormProps {
  groupName: string;
  groupImage: File | null;
  currentGroupImage: string | null;
  onNameChange: (name: string) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onValidation: (isValid: boolean) => void;
}

const EditGroupForm = ({
  groupName,
  groupImage,
  currentGroupImage,
  onNameChange,
  onImageChange,
  onSubmit,
  onValidation,
}: EditGroupFormProps) => {
  const [isGroupNameValid, setIsGroupNameValid] = useState(true);

  const handleGroupNameValidation = (isValid: boolean) => {
    setIsGroupNameValid(isValid);
    onValidation(isValid);
  };

  const handleSubmit = async () => {
    if (isGroupNameValid) {
      try {
        await onSubmit(); // 비동기 함수 호출 시 await 처리
        console.log('그룹 수정 완료'); // 성공 메시지
      } catch (error) {
        console.error('그룹 수정 실패:', error); // 실패 시 에러 핸들링
      }
    } else {
      console.error('유효하지 않은 그룹 이름');
    }
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <GroupImageUpload
        groupImage={groupImage}
        onImageChange={onImageChange}
        currentImageUrl={currentGroupImage}
      />
      <GroupNameInput
        groupName={groupName}
        onNameChange={onNameChange}
        onValidation={handleGroupNameValidation}
      />
      <button
        onClick={handleSubmit}
        className={`w-full py-3 rounded-md transition-colors ${
          isGroupNameValid
            ? 'bg-primary text-white hover:bg-purple-700'
            : 'bg-gray-500 text-gray-300 cursor-not-allowed'
        }`}
        disabled={!isGroupNameValid}
      >
        저장
      </button>
    </div>
  );
};

export default EditGroupForm;
