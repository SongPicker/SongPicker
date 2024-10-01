import React, { useRef } from 'react';
import { MdOutlineAddCircleOutline } from 'react-icons/md';

interface GroupImageUploadProps {
  groupImage: File | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentImageUrl?: string;
}

const GroupImageUpload: React.FC<GroupImageUploadProps> = ({
  groupImage,
  onImageChange,
  currentImageUrl,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-6">
      <label className="block text-white text-center mb-2">(선택) 그룹 이미지</label>
      <div
        className="w-32 h-32 bg-gray-700 rounded-md flex items-center justify-center cursor-pointer overflow-hidden"
        onClick={handleImageClick}
      >
        {groupImage ? (
          <img
            src={URL.createObjectURL(groupImage)}
            alt="Group"
            className="w-full h-full object-cover bg-[#CDA7FF] "
          />
        ) : currentImageUrl ? (
          <img
            src={currentImageUrl}
            alt="Current Group"
            className="w-full h-full object-cover bg-[#CDA7FF] "
          />
        ) : (
          <MdOutlineAddCircleOutline className="text-gray-400 text-5xl" />
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        id="groupImage"
        accept="image/*"
        onChange={onImageChange}
        className="hidden"
      />
    </div>
  );
};

export default GroupImageUpload;
