import React from 'react';
import Image from 'next/image';

interface ImageGridProps {
  images: string[];
  onBodyPartClick: (values: string) => void;
}

const array = 
  [
   [ "cardiovascular system"],
    ["abs"],
    ["glutes", "abductors"],
    ["quads", "hamstrings", "adductors"],
    ["calves"],
    ["pectorals"],
    ["lats",  "spine", "upper back"],
    ["levator scapulae", "traps"],
    ["serratus anterior", "delts"],
    ["triceps"],
    ["biceps"],
    ["forearms"],
  ]
  

const ImageGrid: React.FC<ImageGridProps> = ({ images, onBodyPartClick }) => {
  return (
    <div className="flex justify-center items-center">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((src, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-4 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
            onClick={() => onBodyPartClick(src.split('/')[src.split('/').length - 1].split('.')[0].replace(/[-_]/g, ' '))}
          >
            <div className="relative w-48 h-48 m-6 hover:cursor-pointer">
              <Image src={src} layout="fill" objectFit="cover" alt={`Image ${index + 1}`}/>
            </div>
            <p className="text-base md:text-lg lg:text-xl text-gray-800 font-medium my-2 mx-4 leading-relaxed">
              {src.split('/')[src.split('/').length - 1].split('.')[0].charAt(0).toUpperCase() + src.split('/')[src.split('/').length - 1].split('.')[0].slice(1).replace(/[-_]/g, ' ')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGrid;
