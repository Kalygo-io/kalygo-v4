"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAccount } from 'wagmi';
import { toast } from 'react-toastify';
import { useContractRead, useContractActions } from '../../utils/contractInteraction';

const ContractDetailsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const params = useParams();
  const contractAddress = params.address as string;

  const { address } = useAccount();
  const { contractState, isLoading } = useContractRead(contractAddress);
  const { 
    deposit, 
    closeDeal, 
    startArbitration, 
    handleArbitrationResults,
    isPending,
    isConfirming 
  } = useContractActions(contractAddress);

  const [depositAmount, setDepositAmount] = useState('');
  const [arbitrationWinner, setArbitrationWinner] = useState('');

  const handleDeposit = async () => {
    if (!depositAmount) {
      toast.error('Please enter a deposit amount');
      return;
    }
    
    try {
      const amount = BigInt(parseFloat(depositAmount) * 10**18); // Convert to wei
      await deposit(amount);
      toast.success('Deposit initiated');
      setDepositAmount('');
    } catch (err) {
      console.error('Deposit error:', err);
      toast.error('Deposit failed');
    }
  };

  const handleCloseDeal = async () => {
    try {
      await closeDeal();
      toast.success('Deal closed successfully');
    } catch (err) {
      console.error('Close deal error:', err);
      toast.error('Failed to close deal');
    }
  };

  const handleStartArbitration = async () => {
    try {
      await startArbitration();
      toast.success('Arbitration started');
    } catch (err) {
      console.error('Start arbitration error:', err);
      toast.error('Failed to start arbitration');
    }
  };

  const handleArbitrationResult = async () => {
    if (!arbitrationWinner) {
      toast.error('Please enter the winner address');
      return;
    }
    
    try {
      await handleArbitrationResults(arbitrationWinner);
      toast.success('Arbitration result processed');
      setArbitrationWinner('');
    } catch (err) {
      console.error('Arbitration result error:', err);
      toast.error('Failed to process arbitration result');
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contract details...</p>
        </div>
      );
    }

    if (!contractState) {
      return (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-red-600">Failed to load contract details</h3>
          <p className="mt-1 text-sm text-gray-500">Please check the contract address and your network connection.</p>
        </div>
      );
    }

    const isBuyer = address?.toLowerCase() === contractState.buyer.toLowerCase();
    const isSeller = address?.toLowerCase() === contractState.seller.toLowerCase();
    const isEvaluator = address?.toLowerCase() === contractState.evaluatorAddress.toLowerCase();
    const limitationDate = new Date(Number(contractState.limitationDate) * 1000);

    return (
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Contract Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="break-all">
            <p className="text-sm font-medium text-gray-500">Buyer</p>
            <p className="text-md text-gray-900 font-mono">{contractState.buyer}</p>
          </div>
          <div className="break-all">
            <p className="text-sm font-medium text-gray-500">Seller</p>
            <p className="text-md text-gray-900 font-mono">{contractState.seller}</p>
          </div>
          <div className="break-all">
            <p className="text-sm font-medium text-gray-500">Evaluator</p>
            <p className="text-md text-gray-900 font-mono">{contractState.evaluatorAddress}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Limitation Date</p>
            <p className="text-md text-gray-900">{limitationDate.toLocaleString()}</p>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-sm font-medium text-gray-500">Arbitration Status</p>
          <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
            contractState.arbitrationFlag 
              ? 'bg-red-100 text-red-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {contractState.arbitrationFlag ? 'In Arbitration' : 'Active'}
          </span>
        </div>

        {/* Contract Actions */}
        <div className="space-y-6">
          {/* Deposit (Buyer only) */}
          {isBuyer && !contractState.arbitrationFlag && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Deposit Funds</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Amount in USDC"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleDeposit}
                  disabled={isPending || isConfirming}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {isPending ? 'Depositing...' : 'Deposit'}
                </button>
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-4">
            {/* Close Deal (Seller only) */}
            {isSeller && !contractState.arbitrationFlag && (
              <button
                onClick={handleCloseDeal}
                disabled={isPending || isConfirming}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
              >
                {isPending ? 'Processing...' : 'Close Deal'}
              </button>
            )}

            {/* Start Arbitration (Buyer or Seller) */}
            {(isBuyer || isSeller) && !contractState.arbitrationFlag && (
              <button
                onClick={handleStartArbitration}
                disabled={isPending || isConfirming}
                className="flex-1 px-6 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:bg-gray-400"
              >
                {isPending ? 'Processing...' : 'Start Evaluation'}
              </button>
            )}
          </div>

          {/* Handle Arbitration Results (Evaluator only) */}
          {isEvaluator && contractState.arbitrationFlag && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Process Arbitration</h3>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Winner address (0x...)"
                  value={arbitrationWinner}
                  onChange={(e) => setArbitrationWinner(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleArbitrationResult}
                  disabled={isPending || isConfirming}
                  className="w-full px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400"
                >
                  {isPending ? 'Processing...' : 'Process Result'}
                </button>
              </div>
            </div>
          )}

          {/* Placeholder Actions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Additional features</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => toast.info('Coming soon!')}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Leave Note
              </button>
              <button
                onClick={() => toast.info('Coming soon!')}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Open AI Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-500/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">View Contract</h1>
              <p className="text-gray-600 font-mono break-all">{contractAddress}</p>
            </div>
            
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ContractDetailsPage; 