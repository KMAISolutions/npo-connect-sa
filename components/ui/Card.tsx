
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 p-6 sm:p-8 ${className}`}>
      {children}
    </div>
  );
};
