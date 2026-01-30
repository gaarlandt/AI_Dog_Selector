import React from 'react';

interface NavbarProps {
  onRecallClick: () => void;
  onHomeClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onRecallClick, onHomeClick }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-transparent py-4 px-6 md:px-12 flex justify-between items-center">
      <button onClick={onHomeClick} className="flex items-center gap-2 group">
         <img 
           src="https://letsdog.nl/wp-content/uploads/2025/12/Lets-Dog-Logo.svg" 
           alt="Let's Dog" 
           className="h-10 md:h-12 drop-shadow-sm transition-transform group-hover:scale-105"
           style={{ filter: 'brightness(0) invert(1)' }}
         />
      </button>

      <button 
        onClick={onRecallClick}
        className="bg-white/90 backdrop-blur-md text-accent px-4 py-2 rounded-lg shadow-sm hover:bg-white hover:shadow-md transition-all font-medium flex items-center gap-2 text-sm md:text-base border border-gray-100"
      >
        <span className="material-icons-round text-primary">search</span>
        Recall Scan
      </button>
    </nav>
  );
};

export default Navbar;