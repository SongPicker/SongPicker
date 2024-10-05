import React, { useEffect } from 'react';
import { FaSpinner, FaMusic } from 'react-icons/fa';
import { CiLink } from 'react-icons/ci';
import { IconType } from 'react-icons';

interface ConnectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  message: string;
  icon?: 'spinner' | 'link' | 'reservation';
  showCloseButton?: boolean;
  autoCloseDelay?: number;
}

const ConnectionModal = ({
  isVisible,
  onClose,
  message,
  icon = 'spinner',
  showCloseButton = true,
  autoCloseDelay,
}: ConnectionModalProps) => {
  useEffect(() => {
    if (isVisible && autoCloseDelay) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoCloseDelay, onClose]);

  if (!isVisible) return null;

  let IconComponent: IconType;
  switch (icon) {
    case 'link':
      IconComponent = CiLink;
      break;
    case 'reservation':
      IconComponent = FaMusic;
      break;
    case 'spinner':
    default:
      IconComponent = FaSpinner;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[999] max-w-[640px] mx-auto">
      <div className="bg-[#333] p-8 rounded-lg shadow-xl flex flex-col items-center min-w-[260px]">
        <IconComponent
          className={`text-6xl text-primary mb-6 ${icon === 'spinner' ? 'animate-spin' : ''}`}
        />
        <p className="text-xl font-semibold text-center text-white mb-4">{message}</p>
        {showCloseButton && !autoCloseDelay && (
          <button className="mt-4 bg-[#9747FF] text-white px-4 py-2 rounded" onClick={onClose}>
            확인
          </button>
        )}
      </div>
    </div>
  );
};

export default ConnectionModal;
