"use client";

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'react-toastify';
import { useContractRead, useContractActions } from '../utils/contractInteraction';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

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

        <div className="mb-0">
          <p className="text-sm font-medium text-gray-700">Status</p>
          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
            contractState.arbitrationFlag 
              ? 'bg-red-100 text-red-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {contractState.arbitrationFlag ? 'In Arbitration' : 'Active'}
          </span>
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
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push(`/dapp/contract/${contract.address}`)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  View Details
                </button>
                <button
                  onClick={() => setSelectedContract(
                    selectedContract === contract.address ? null : contract.address
                  )}
                  className="px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  {selectedContract === contract.address ? 'Hide' : 'Show More'}
                </button>
              </div>
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