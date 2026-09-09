import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`w-full max-w-[1240px] mx-auto px-6 md:px-10 xl:px-20 ${className}`}>
      {children}
    </div>
  );
}