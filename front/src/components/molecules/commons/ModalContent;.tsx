import React from 'react';
import ModalButton from '../../atoms/commons/ModalButton';

type ModalContentProps = {
  message: React.ReactNode;
  leftButtonText?: string;
  rightButtonText: string;
  onLeftClick?: () => void;
  onRightClick: () => void;
};

const ModalContent = ({
  message,
  leftButtonText,
  rightButtonText,
  onLeftClick,
  onRightClick,
}: ModalContentProps) => {
  return (
    <div className="text-center">
      <p className="text-white mb-4 font-medium text-lg">{message}</p>
      <div className="flex justify-center space-x-2">
        {leftButtonText && onLeftClick && (
          <ModalButton variant="primary" onClick={onLeftClick}>
            {leftButtonText}
          </ModalButton>
        )}
        <ModalButton variant="accent" onClick={onRightClick}>
          {rightButtonText}
        </ModalButton>
      </div>
    </div>
  );
};

export default ModalContent;
