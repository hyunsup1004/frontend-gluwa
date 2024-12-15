import React from 'react';

interface LoadingDotProps {
  size?: 'lg' | 'sm' | 'md' | 'xsm';
  displayType?: 'block' | 'inline';
}

const LoadingDot: React.FC<LoadingDotProps> = ({ size = '', displayType = 'block' }) => {
  const sizeClass = size ? `dot-loading ${size}` : 'dot-loading';
  const displayClass = displayType === 'inline' ? 'inline' : ''; 

  return (
    <div className={`${sizeClass} ${displayClass}`}>
      <span className="dot1"></span>
      <span className="dot2"></span>
      <span className="dot3"></span>
    </div>
  );
};

export default LoadingDot;
