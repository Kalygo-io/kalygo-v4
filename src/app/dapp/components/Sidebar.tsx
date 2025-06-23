"use client";

import { useRouter, usePathname } from 'next/navigation';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
    const router = useRouter();
    const pathname = usePathname();
    
    const navItems = [
      { name: 'Home', icon: 'home', path: '/dapp/home' },
      { name: 'Contract', icon: 'contract', path: '/dapp/contract' },
      { name: 'Transactions', icon: 'transactions', path: '/dapp/transactions' },
      { name: 'Marketplace', icon: 'marketplace', path: '/dapp/marketplace' },
      { name: 'Reputation', icon: 'reputation', path: '/dapp/reputation' },
    ];

    const handleNavClick = (path: string) => {
      router.push(path);
      if (onClose) {
        onClose();
      }
    };
  
    const getIcon = (iconName: string) => {
      switch (iconName) {
        case 'home':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          );
        case 'contract':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          );
        case 'transactions':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          );
        case 'marketplace':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          );
        case 'reputation':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          );
        default:
          return null;
      }
    };

    const handleMediatorClick = () => {
      router.push('/');
    };
  
    return (
      <div className="w-64 bg-blue-600 text-white flex flex-col h-full">
        <div className="p-4 border-b border-blue-700 flex items-center justify-between">
          <h1 
            className="text-2xl font-bold cursor-pointer hover:text-blue-200 transition-colors"
            onClick={handleMediatorClick}
          >
            Mediator
          </h1>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-2 text-white hover:text-blue-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <nav className="flex-1 p-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={item.name}
                className={`w-full flex items-center p-3 my-1 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-700'
                    : 'hover:bg-blue-700'
                }`}
                onClick={() => handleNavClick(item.path)}
              >
                {getIcon(item.icon)}
                <span className="ml-4">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>
    );
  };
  
  export default Sidebar; 