import React from 'react';
import Image from '../images/header.png';

const ImagePageHeader = ({ page_name }) => {
  return (
    <div 
      className="flex lg:block hidden items-center m-10 p-8 md:p-6 rounded-xl mb-4 min-h-[320px] relative overflow-hidden"
      style={{
        backgroundImage: `url(${Image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
    </div>
  );
};

export default ImagePageHeader;