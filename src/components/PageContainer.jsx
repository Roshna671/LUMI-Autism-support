import React from 'react';

export default function PageContainer({ children, className = '' }) {
  return (
    <div className={`page-shell flex flex-col justify-center select-none text-[#45208F] relative z-10 ${className}`}>
      {children}
    </div>
  );
}
