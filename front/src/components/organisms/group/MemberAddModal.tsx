import React, { useState, useCallback } from 'react';
import BottomSlideModal from '../../template/commons/BottomSlideModal';
import CustomModal from '../../organisms/commons/CustomModal';
import { inviteMembers } from '../../../services/groupService';
import CustomAlert from '../../template/commons/CustomAlertModal';
import { IoClose } from 'react-icons/io5';

interface MemberAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: number;
  onMembersInvited: () => void;
}

const MemberAddModal = ({ isOpen, onClose, teamId, onMembersInvited }: MemberAddModalProps) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ title: string; description: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddMember = () => {
    if (inputValue && !selectedMembers.includes(inputValue)) {
      setSelectedMembers([...selectedMembers, inputValue]);
      setInputValue('');
    }
  };

  const handleRemoveMember = (member: string) => {
    setSelectedMembers(selectedMembers.filter(m => m !== member));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await inviteMembers(teamId, selectedMembers);
      if (response.code === 'TE101') {
        const { successfulInvites, alreadyInGroup, previouslyInvited } = response.data;
        let description = '';
        if (successfulInvites.length > 0) {
          description += `초대 성공! ( ${successfulInvites.join(', ')} )\n`;
        }
        if (alreadyInGroup.length > 0) {
          description += `이미 그룹에 있습니다! ( ${alreadyInGroup.join(', ')} )\n`;
        }
        if (previouslyInvited.length > 0) {
          description += `초대중인 회원입니다! ( ${previouslyInvited.join(', ')} )`;
        }
        setAlert({ title: '멤버 초대 결과', description: description.trim() });
        onMembersInvited();
        resetModalState();
        onClose();
      } else if (response.code === 'ME009') {
        setAlert({
          title: '초대 실패!',
          description: '존재하지 않는 회원이 있습니다.\n다시 확인해 주세요.',
        });
      } else {
        setAlert({
          title: '초대 실패',
          description: '멤버 초대에 실패했습니다.\n다시 시도해주세요.',
        });
      }
    } catch (error) {
      setAlert({
        title: '오류 발생',
        description: '멤버 초대 중 오류가 발생했습니다.\n다시 시도해주세요.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (selectedMembers.length > 0 || inputValue.trim() !== '') {
      setIsConfirmModalOpen(true);
    } else {
      resetModalState();
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setIsConfirmModalOpen(false);
    resetModalState();
    onClose();
  };

  const resetModalState = () => {
    setSelectedMembers([]);
    setInputValue('');
  };

  return (
    <>
      <BottomSlideModal isOpen={isOpen} onClose={handleClose} title="멤버 추가" height="auto">
        <div className="p-4">
          <div className="mb-4">
            <p className="text-white mb-2">닉네임으로 초대하기</p>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="닉네임 입력"
                value={inputValue}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-sm rounded-full bg-gray-700 text-white pr-20"
              />
              <button
                onClick={handleAddMember}
                className="btn btn-md btn-accent ml-3 text-white rounded-full min-w-[70px]"
              >
                추가
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {selectedMembers.map(member => (
              <div
                key={member}
                className="flex items-center px-3 py-1 bg-gray-800 text-white rounded-full"
              >
                {member}
                <IoClose
                  size={16}
                  onClick={() => handleRemoveMember(member)}
                  className="ml-2 text-gray-400 hover:text-gray-300"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="btn btn-primary w-full py-3 text-white rounded-lg"
            disabled={isLoading || selectedMembers.length === 0}
          >
            {isLoading ? '초대 중...' : '초대 완료'}
          </button>
        </div>
      </BottomSlideModal>

      <CustomModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        message="멤버 추가를 중단하시겠습니까?"
        leftButtonText="중단하기"
        rightButtonText="취소"
        onLeftClick={handleConfirmClose}
      />

      {alert && (
        <CustomAlert
          title={alert.title}
          description={alert.description}
          onClose={() => setAlert(null)}
          duration={3000} // 3초 동안 표시
        />
      )}
    </>
  );
};

export default MemberAddModal;
