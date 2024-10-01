import React from 'react';

interface GroupImageProps {
  src: string;
  alt: string;
}

const GroupImage = ({ src, alt }: GroupImageProps) => (
  <div className="w-4/5 aspect-w-1 aspect-h-1 bg-[#CDA7FF] min-h-24 max-h-full mb-3 flex items-center justify-center rounded">
    {src ? (
      <img src={src} alt={alt} className="w-full h-full object-cover rounded-md" />
    ) : (
      <span className="text-gray-400 text-sm">{alt}</span>
    )}
  </div>
);

export default GroupImage;
