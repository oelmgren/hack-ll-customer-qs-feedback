import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

const sizeClasses = {
  sm: 'h-6',
  md: 'h-8', 
  lg: 'h-12',
  xl: 'h-16'
};

export function Logo({ size = 'md', className = '', showText = false }: LogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/assets/images/logo.png" 
        alt="Listen Labs Logo" 
        className={`${sizeClasses[size]} w-auto`}
      />
      {showText && (
        <span className={`font-semibold ${
          size === 'sm' ? 'text-sm' : 
          size === 'md' ? 'text-xl' : 
          size === 'lg' ? 'text-2xl' : 
          'text-3xl'
        }`}>
          Listen Labs
        </span>
      )}
    </div>
  );
} 