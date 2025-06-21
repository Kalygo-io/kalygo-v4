"use client";

import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DappPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Toast Container */}
      <ToastContainer />
      
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                  Mediator
                </h1>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  onClick={handleBackToHome}
                >
                  Back to Home
                </button>
              </div>
            </div>
            <div className="md:hidden">
              <button 
                className="text-gray-700 hover:text-blue-600 p-2"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg">
            <div className="flex justify-end p-4">
              <button 
                className="text-gray-700 hover:text-blue-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-4 py-2">
              <button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                onClick={handleBackToHome}
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              dApp
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent"> Page</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              This is a simple dApp page. You can only navigate here through the URL bar.
            </p>
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-8 shadow-lg max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Welcome to the dApp Page
              </h2>
              <p className="text-gray-600 mb-6">
                This page demonstrates that you can access it directly via the URL bar at <code className="bg-gray-100 px-2 py-1 rounded text-sm">/dapp</code>.
              </p>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Page Features:
                </h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Direct URL access only</li>
                  <li>• Consistent styling with main app</li>
                  <li>• Responsive design</li>
                  <li>• Back to home navigation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-blue-300 rounded-full opacity-30 animate-bounce"></div>
      </section>
    </div>
  );
} 