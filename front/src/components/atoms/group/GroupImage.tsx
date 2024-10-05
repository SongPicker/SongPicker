import React from 'react';

interface GroupImageProps {
  src: string | null;
  alt: string;
}

const GroupImage = ({ src, alt }: GroupImageProps) => (
  <div className="w-4/5 aspect-square bg-[#CDA7FF] object-cover rounded-md mb-3 flex items-center justify-center overflow-hidden">
    {src ? (
      <img src={src} alt={alt} className="w-full h-full object-cover rounded-md" />
    ) : (
      <img src="basicImg.png" alt="SongPicker" className="w-full h-full object-cover rounded-md" />
    )}
  </div>
);

export default GroupImage;
