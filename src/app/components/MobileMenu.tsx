"use client";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div className={`
        fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
              Mediator
            </h1>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Menu Items */}
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-4">
              <li>
                <a 
                  href="#features" 
                  className="block text-gray-700 hover:text-blue-600 py-2 text-lg font-medium transition-colors"
                  onClick={onClose}
                >
                  Features
                </a>
              </li>
              <li>
                <a 
                  href="#roadmap" 
                  className="block text-gray-700 hover:text-blue-600 py-2 text-lg font-medium transition-colors"
                  onClick={onClose}
                >
                  Roadmap
                </a>
              </li>
              <li>
                <a 
                  href="#team" 
                  className="block text-gray-700 hover:text-blue-600 py-2 text-lg font-medium transition-colors"
                  onClick={onClose}
                >
                  Team
                </a>
              </li>
              <li>
                <a 
                  href="#tokenomics" 
                  className="block text-gray-700 hover:text-blue-600 py-2 text-lg font-medium transition-colors"
                  onClick={onClose}
                >
                  Tokenomics
                </a>
              </li>
            </ul>
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-lg font-semibold transition-colors">
              Enter dApp
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 