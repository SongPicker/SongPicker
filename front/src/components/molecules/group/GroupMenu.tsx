import React, { useState } from 'react';
import CloseIconButton from '../../atoms/group/CloseIconButton';
import CustomModal from '../../organisms/commons/CustomModal';
import { leaveGroup } from '../../../services/groupService';

interface GroupMenuProps {
  teamId: number;
  onClose: () => void; // 이벤트 객체를 받지 않는 함수로 정의
  onAddMemberClick: (e: React.MouseEvent<Element, MouseEvent>) => void;
  onEditClick: (e: React.MouseEvent<Element, MouseEvent>) => void;
  onGroupLeft: (teamId: number) => void;
}

const GroupMenu = ({
  teamId,
  onClose,
  onAddMemberClick,
  onEditClick,
  onGroupLeft,
}: GroupMenuProps) => {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  // 그룹 나가기 버튼 클릭 처리
  const handleLeaveClick = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.stopPropagation(); // 클릭 이벤트 상위 전파 방지
    setIsLeaveModalOpen(true);
  };

  // 그룹 나가기 확인 처리
  const handleLeaveConfirm = async () => {
    try {
      const response = await leaveGroup(teamId);
      if (response.code === 'TE102') {
        console.log('그룹 나가기 성공');
        onGroupLeft(teamId); // 그룹 나간 후 목록에서 제거
        onClose(); // 메뉴 닫기
      } else {
        console.error('그룹 나가기 실패:', response.message);
      }
    } finally {
      setIsLeaveModalOpen(false);
    }
  };

  return (
    <>
      <div
        className="absolute right-0 mt-1 w-32 bg-gray-700 bg-opacity-90 rounded-md shadow-lg overflow-hidden z-10 transition-all duration-300 ease-in-out origin-top-right scale-100 opacity-100"
        onClick={e => e.stopPropagation()} // 메뉴 클릭 시 상위 클릭 이벤트 전파 방지
      >
        <div className="relative">
          {/* 이벤트 객체가 필요 없으므로 onClose에서 객체 전달을 제거 */}
          <CloseIconButton onClick={onClose} />
        </div>
        <div className="py-2">
          <button
            className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
            onClick={e => {
              e.stopPropagation(); // 클릭 이벤트 상위 전파 방지
              onAddMemberClick(e);
            }}
          >
            멤버 추가
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
            onClick={e => {
              e.stopPropagation(); // 클릭 이벤트 상위 전파 방지
              onEditClick(e);
            }}
          >
            그룹 편집
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
            onClick={handleLeaveClick} // 그룹 나가기 버튼 클릭
          >
            그룹 나가기
          </button>
        </div>
      </div>

      <CustomModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        message="그룹을 나가시겠습니까?"
        leftButtonText="나가기"
        rightButtonText="취소"
        onLeftClick={handleLeaveConfirm} // 그룹 나가기 확인 시 실행
      />
    </>
  );
};

export default GroupMenu;
