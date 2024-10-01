import React, { useEffect, useCallback } from 'react';
import ModalContent from '../../molecules/commons/ModalContent;';

type CustomModalProps = {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  leftButtonText?: string;
  rightButtonText: string;
  onLeftClick?: () => void;
};

const CustomModal = ({
  isOpen,
  onClose,
  message,
  leftButtonText,
  rightButtonText,
  onLeftClick,
}: CustomModalProps) => {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden">
      <div
        className="fixed inset-0 bg-black opacity-50 w-screen max-w-[640px] mx-auto"
        onClick={onClose}
      ></div>
      <div className="relative bg-[#333] rounded-lg p-6 max-w-sm w-full mx-4">
        <ModalContent
          message={message}
          leftButtonText={leftButtonText}
          rightButtonText={rightButtonText}
          onLeftClick={onLeftClick}
          onRightClick={onClose}
        />
      </div>
    </div>
  );
};

export default CustomModal;
