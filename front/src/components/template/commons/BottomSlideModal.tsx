import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';

interface BottomSlideModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: string;
  title: string;
}

const BottomSlideModal = ({
  isOpen,
  onClose,
  children,
  height = '70vh',
  title,
}: BottomSlideModalProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        document.body.style.overflow = '';
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleBackButton = (event: PopStateEvent) => {
      if (isOpen) {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener('popstate', handleBackButton);
    return () => window.removeEventListener('popstate', handleBackButton);
  }, [isOpen, onClose]);

  if (!isOpen && !isAnimating) return null;

  return (
    <div className="w-screen max-w-[640px] mx-auto fixed inset-0 z-[9989] flex items-end justify-center">
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      <div
        className={`bg-[#222] w-full rounded-t-xl overflow-hidden transform transition-all duration-300 ease-out ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
        style={{ height: height, maxHeight: '90vh' }}
      >
        <div className="w-full flex justify-center pt-2 pb-3">
          <div className="w-14 h-[3px] bg-white rounded-full" />
        </div>
        <div className="px-4 py-3 border-b border-purple-500 flex items-center relative">
          <h2 className="text-white text-lg font-semibold text-center w-[75%] mx-auto">{title}</h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
            aria-label="Close modal"
          >
            <IoClose size={28} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto" style={{ maxHeight: `calc(${height} - 4rem)` }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default BottomSlideModal;
