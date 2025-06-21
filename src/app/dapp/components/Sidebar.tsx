"use client";

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
    const navItems = [
      { name: 'Home', icon: 'home' },
      { name: 'Contract', icon: 'contract', active: true },
      { name: 'Transactions', icon: 'transactions' },
    ];
  
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
        default:
          return null;
      }
    };
  
    return (
      <div className="w-64 bg-blue-600 text-white flex flex-col h-full">
        <div className="p-4 border-b border-blue-700 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Mediator</h1>
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
          {navItems.map((item) => (
            <a
              key={item.name}
              href="#"
              className={`flex items-center p-3 my-1 rounded-lg transition-colors ${
                item.active
                  ? 'bg-blue-700'
                  : 'hover:bg-blue-700'
              }`}
              onClick={onClose}
            >
              {getIcon(item.icon)}
              <span className="ml-4">{item.name}</span>
            </a>
          ))}
        </nav>
      </div>
    );
  };
  
  export default Sidebar; 