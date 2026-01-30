import React from 'react';

const LoadingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 bg-accent/90 backdrop-blur-sm flex flex-col items-center justify-center text-white">
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
           <span className="material-icons-round text-5xl">pets</span>
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-2 font-heading">Scanning...</h2>
      <p className="text-white/70">Identifying breed characteristics</p>
    </div>
  );
};

export default LoadingOverlay;