"use client";

import WalletConnectorButton from './WalletConnector';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {

    return (
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-gray-600 hover:text-gray-800 transition-colors"
          onClick={onMenuClick}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {/* Desktop Spacer */}
        <div className="hidden md:block"></div>
        
        {/* Right side buttons */}
        <div className="flex items-center">
          <WalletConnectorButton />
        </div>
      </header>
    );
  };
  
  export default Header; 