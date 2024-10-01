import React, { useState, useEffect } from 'react';
import BottomSlideModal from '../../template/commons/BottomSlideModal';
import EditGroupForm from '../../molecules/group/EditGroupForm';
import { editGroup } from '../../../services/groupService';
import CustomModal from '../../organisms/commons/CustomModal';
import { useNavigate } from 'react-router-dom';

interface Group {
  teamId: number;
  teamImage: string;
  teamName: string;
  teamMemberCount: number;
}

interface EditGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group;
  onGroupEdited: (updatedGroup: Group) => Promise<void>;
}

const EditGroupModal = ({ isOpen, onClose, group, onGroupEdited }: EditGroupModalProps) => {
  const [groupName, setGroupName] = useState(group.teamName);
  const [groupImage, setGroupImage] = useState<File | null>(null);
  const [isGroupNameValid, setIsGroupNameValid] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    setGroupName(group.teamName);
  }, [group]);

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
      }

      try {
        const response = await editGroup(group.teamId, formData);

        // 성공 처리 코드 범위 확장 (TE102와 TE105를 성공으로 간주)
        if (response.code === 'TE102' || response.code === 'TE105') {
          console.log('그룹 수정 성공:', response.data);
          const updatedGroup: Group = {
            ...group,
            teamName: groupName,
            teamImage: groupImage ? URL.createObjectURL(groupImage) : group.teamImage,
          };
          await onGroupEdited(updatedGroup); // 상태 업데이트 콜백 호출
          onClose(); // 성공 시 모달 닫기
        } else {
          console.error('그룹 수정 실패:', response.message);
          throw new Error('그룹 수정 실패 - 서버 응답 코드 확인 필요');
        }
      } catch (error) {
        console.error('그룹 수정 실패:', error);
      }
    } else {
      console.log('유효하지 않은 그룹 이름');
    }
  };

  const handleClose = () => {
    if (groupName !== group.teamName || groupImage) {
      setIsConfirmModalOpen(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setIsConfirmModalOpen(false);
    onClose();
    setGroupName(group.teamName);
    setGroupImage(null);
  };

  return (
    <>
      <BottomSlideModal isOpen={isOpen} onClose={handleClose} title="그룹 편집" height="auto">
        <EditGroupForm
          groupName={groupName}
          groupImage={groupImage}
          currentGroupImage={group.teamImage}
          onNameChange={handleNameChange}
          onImageChange={handleImageChange}
          onSubmit={handleSubmit}
          onValidation={setIsGroupNameValid}
        />
      </BottomSlideModal>
      <CustomModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        message="그룹 편집을 중단하시겠습니까?"
        leftButtonText="중단하기"
        rightButtonText="취소"
        onLeftClick={handleConfirmClose}
      />
    </>
  );
};

export default EditGroupModal;
