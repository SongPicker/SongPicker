import React from 'react';

type Props = {
  isLiked: boolean;
  onToggle: () => void;
};

const LikeButton = ({ onToggle, isLiked }: Props) => {
  // const [isLiked, setIsLiked] = useState(initialLiked);

  // const handleClick = () => {
  //   const newLikedState = !isLiked;
  //   setIsLiked(newLikedState);
  //   if (onToggle) {
  //     onToggle(newLikedState);
  //   }
  //   if (newLikedState && onLike) {
  //     onLike();
  //   }
  // };

  return (
    <button
      className={`px-2 py-1.5 rounded-sm cursor-pointer text-sm font-medium transition-colors
        ${
          isLiked
            ? 'bg-gray-200 text-gray-500'
            : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
        }`}
      onClick={onToggle}
      aria-pressed={isLiked}
    >
      {isLiked ? '찜해제' : '찜하기'}
    </button>
  );
};

export default LikeButton;
