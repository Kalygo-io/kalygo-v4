"use client";

import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ContractForm from './components/ContractForm';
import Header from './components/Header';

export default function DappPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-500/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Mobile Sidebar Drawer */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-blue-600 text-white z-50 transform transition-transform duration-300 ease-in-out md:hidden
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>
      
      <div className="flex-1 flex flex-col">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-8">
          <ContractForm />
        </main>
      </div>
    </div>
  );
} 