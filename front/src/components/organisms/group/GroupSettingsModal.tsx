import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { AiOutlineEdit, AiOutlineLogout } from 'react-icons/ai';

interface GroupSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditGroup: () => void;
  onLeaveGroup: () => void;
}

const GroupSettingsModal = ({
  isOpen,
  onClose,
  onEditGroup,
  onLeaveGroup,
}: GroupSettingsModalProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let timer: number;

    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      timer = window.setTimeout(() => {
        setIsAnimating(false);
        document.body.style.overflow = '';
      }, 300);
    }

    return () => window.clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end items-start transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 배경 어둡게 처리
        top: '3.5rem',
      }}
      onClick={onClose} // 모달 외부를 누르면 닫힘
    >
      <div
        className={`bg-white rounded-b-2xl  shadow-lg transform transition-transform duration-300 ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
        onClick={e => e.stopPropagation()} // 모달 내부를 누를 때는 닫히지 않도록 이벤트 전파 방지
      >
        {/* 메뉴 항목 */}
        <div className="flex flex-col gap-2 p-2">
          <button
            className="flex items-center py-2 px-4 text-sm text-gray-700 hover:bg-gray-100"
            onClick={onEditGroup}
          >
            <AiOutlineEdit size={18} className="mr-3" />
            그룹 편집
          </button>
          <hr className="my-1" />
          <button
            className="flex items-center py-2 px-4 text-sm text-gray-700 hover:bg-gray-100"
            onClick={onLeaveGroup}
          >
            <AiOutlineLogout size={18} className="mr-3" />
            그룹 나가기
          </button>
        </div>

        {/* 닫기 버튼 - 아래로 이동 */}
        <div className="flex justify-end p-2">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <IoClose size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupSettingsModal;
