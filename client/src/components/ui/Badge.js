import React from 'react';

const Badge = ({ count }) => {
  return (
    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center neubrutalism">
      {count}
    </div>
  );
};

export default Badge; 