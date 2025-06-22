"use client";

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'react-toastify';
import { useContractRead, useContractActions } from '../utils/contractInteraction';

interface ContractListProps {
  contracts: Array<{
    address: string;
    deployedAt: string;
    transactionHash: string;
  }>;
}

const ContractList = ({ contracts }: ContractListProps) => {
  const { address } = useAccount();
  const [selectedContract, setSelectedContract] = useState<string | null>(null);

  const ContractDetails = ({ contractAddress }: { contractAddress: string }) => {
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

    if (isLoading) {
      return (
        <div className="p-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading contract details...</p>
        </div>
      );
    }

    if (!contractState) {
      return (
        <div className="p-4 text-center text-red-600">
          Failed to load contract details
        </div>
      );
    }

    const isBuyer = address?.toLowerCase() === contractState.buyer.toLowerCase();
    const isSeller = address?.toLowerCase() === contractState.seller.toLowerCase();
    const isEvaluator = address?.toLowerCase() === contractState.evaluatorAddress.toLowerCase();
    const limitationDate = new Date(Number(contractState.limitationDate) * 1000);

    return (
      <div className="p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Contract Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm font-medium text-gray-700">Buyer</p>
            <p className="text-sm text-gray-900 font-mono">{contractState.buyer}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Seller</p>
            <p className="text-sm text-gray-900 font-mono">{contractState.seller}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Evaluator</p>
            <p className="text-sm text-gray-900 font-mono">{contractState.evaluatorAddress}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Limitation Date</p>
            <p className="text-sm text-gray-900">{limitationDate.toLocaleString()}</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700">Arbitration Status</p>
          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
            contractState.arbitrationFlag 
              ? 'bg-red-100 text-red-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {contractState.arbitrationFlag ? 'In Arbitration' : 'Active'}
          </span>
        </div>

        {/* Contract Actions */}
        <div className="space-y-4">
          {/* Deposit (Buyer only) */}
          {isBuyer && !contractState.arbitrationFlag && (
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Amount in ETH"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleDeposit}
                disabled={isPending || isConfirming}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isPending ? 'Depositing...' : 'Deposit'}
              </button>
            </div>
          )}

          {/* Close Deal (Seller only) */}
          {isSeller && !contractState.arbitrationFlag && (
            <button
              onClick={handleCloseDeal}
              disabled={isPending || isConfirming}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              {isPending ? 'Processing...' : 'Close Deal'}
            </button>
          )}

          {/* Start Arbitration (Buyer or Seller) */}
          {(isBuyer || isSeller) && !contractState.arbitrationFlag && (
            <button
              onClick={handleStartArbitration}
              disabled={isPending || isConfirming}
              className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:bg-gray-400"
            >
              {isPending ? 'Processing...' : 'Start Arbitration'}
            </button>
          )}

          {/* Handle Arbitration Results (Evaluator only) */}
          {isEvaluator && contractState.arbitrationFlag && (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Winner address (0x...)"
                value={arbitrationWinner}
                onChange={(e) => setArbitrationWinner(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleArbitrationResult}
                disabled={isPending || isConfirming}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400"
              >
                {isPending ? 'Processing...' : 'Process Arbitration Result'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (contracts.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No contracts found</h3>
        <p className="mt-1 text-sm text-gray-500">Deploy your first contract to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {contracts.map((contract) => (
        <div key={contract.address} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Contract</h3>
                <p className="text-sm text-gray-500 font-mono">{contract.address}</p>
                <p className="text-xs text-gray-400">Deployed: {new Date(contract.deployedAt).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => setSelectedContract(
                  selectedContract === contract.address ? null : contract.address
                )}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
              >
                {selectedContract === contract.address ? 'Hide Details' : 'View Details'}
              </button>
            </div>
          </div>
          
          {selectedContract === contract.address && (
            <ContractDetails contractAddress={contract.address} />
          )}
        </div>
      ))}
    </div>
  );
};

export default ContractList; 