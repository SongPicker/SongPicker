import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomSlideModal from '../../template/commons/BottomSlideModal';
import GroupForm from '../../molecules/group/CreateGroupForm';
import { createGroup } from '../../../services/groupService';
import CustomModal from '../../organisms/commons/CustomModal';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupCreated: () => Promise<void>;
}

const CreateGroupModal = ({ isOpen, onClose, onGroupCreated }: CreateGroupModalProps) => {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('');
  const [groupImage, setGroupImage] = useState<File | null>(null);
  const [isGroupNameValid, setIsGroupNameValid] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setGroupImage(e.target.files[0]);
    }
  };

  const handleNameChange = (name: string) => {
    setGroupName(name);
  };

  const handleSubmit = async () => {
    if (isGroupNameValid) {
      const formData = new FormData();
      formData.append('teamName', groupName);

      if (groupImage) {
        formData.append('teamImage', groupImage);
      } else {
        // 이미지가 없을 경우 빈 파일을 추가
        const emptyBlob = new Blob([''], { type: 'application/octet-stream' });
        formData.append('teamImage', emptyBlob, 'empty.txt');
      }

      try {
        const response = await createGroup(formData);
        if (response && response.code === 'TE100') {
          console.log('그룹 생성 성공:', response.data);
          onClose();
          await onGroupCreated();
          navigate(`/group/${response.data}`);
        } else {
          console.error('그룹 생성 실패');
        }
      } catch (error) {
        console.error('그룹 생성 실패:', error);
      }
    } else {
      console.error('그룹 생성 실패');
    }
  };

  const handleClose = () => {
    if (groupName || groupImage) {
      setIsConfirmModalOpen(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setIsConfirmModalOpen(false);
    onClose();
    setGroupName('');
    setGroupImage(null);
  };

  return (
    <>
      <BottomSlideModal isOpen={isOpen} onClose={handleClose} title="새 그룹 만들기" height="auto">
        <GroupForm
          groupName={groupName}
          groupImage={groupImage}
          onNameChange={handleNameChange}
          onImageChange={handleImageChange}
          onSubmit={handleSubmit}
          onValidation={setIsGroupNameValid}
        />
      </BottomSlideModal>
      <CustomModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        message="그룹 생성을 중단하시겠습니까?"
        leftButtonText="중단하기"
        rightButtonText="취소"
        onLeftClick={handleConfirmClose}
      />
    </>
  );
};

export default CreateGroupModal;
