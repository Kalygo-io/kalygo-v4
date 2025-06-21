"use client";

import Sidebar from './components/Sidebar';
import ContractForm from './components/ContractForm';
import Header from './components/Header';

export default function DappPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8">
          <ContractForm />
        </main>
      </div>
    </div>
  );
} 