"use client";

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ContractForm from '../components/ContractForm';

export default function ContractPage() {
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
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Contract</h1>
              <p className="text-gray-600">Set up a new escrow agreement with secure mediation</p>
            </div>
            
            <ContractForm />
          </div>
        </main>
      </div>
    </div>
  );
} 