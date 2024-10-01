import React from 'react';

type ModalButtonProps = {
  onClick: () => void;
  variant: 'primary' | 'accent';
  children: React.ReactNode;
};

const ModalButton = ({ onClick, variant, children }: ModalButtonProps) => {
  const baseClasses = 'btn text-sm !h-[25px] !w- !min-h-0 font-semibold';
  const variantClasses = variant === 'primary' ? 'btn-primary' : 'btn-accent';

  return (
    <button className={`${baseClasses} ${variantClasses}`} onClick={onClick}>
      <span className="text-white">{children}</span>
    </button>
  );
};

export default ModalButton;
