"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DeployedContract } from '../utils/contractStorage';

interface ContractListProps {
  contracts: DeployedContract[];
}

const ContractList = ({ contracts }: ContractListProps) => {
  const [selectedContract, setSelectedContract] = useState<string | null>(null);
  const router = useRouter();

  const getContractTypeName = (type: 'simple' | 'acp') => {
    switch (type) {
      case 'simple':
        return 'Simple Contract';
      case 'acp':
        return 'ACP Contract';
      default:
        return 'Contract';
    }
  };

  const getTypeColor = (type: 'simple' | 'acp') => {
    switch (type) {
      case 'simple':
        return 'bg-blue-100 text-blue-800';
      case 'acp':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
                <span className={`inline-flex px-2 py-1 mb-1 text-xs font-semibold rounded-full ${getTypeColor(contract.type)}`}>
                  {getContractTypeName(contract.type)}
                </span>
                <p className="text-sm text-gray-500 font-mono">{contract.address}</p>
                <p className="text-xs text-gray-400 mt-1">Deployed: {new Date(contract.deployedAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2">
                {contract.type === 'simple' && (
                  <button
                    onClick={() => router.push(`/dapp/contract/${contract.address}`)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    View Details
                  </button>
                )}
                {contract.type === 'acp' && (
                  <button
                    onClick={() => router.push(`/dapp/acp-contract/${contract.address}`)}
                    className="px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    View Details
                  </button>
                )}
                <button
                  onClick={() => setSelectedContract(
                    selectedContract === contract.address ? null : contract.address
                  )}
                  className="px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  {selectedContract === contract.address ? 'Hide Info' : 'Show Info'}
                </button>
              </div>
            </div>
          </div>
          
          {selectedContract === contract.address && (
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Contract Details</h3>
              {contract.type === 'simple' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Buyer</p>
                    <p className="text-sm text-gray-900 font-mono break-all">{contract.buyer}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Seller</p>
                    <p className="text-sm text-gray-900 font-mono break-all">{contract.seller}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Evaluator</p>
                    <p className="text-sm text-gray-900 font-mono break-all">{contract.evaluatorAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Limitation Date</p>
                    <p className="text-sm text-gray-900">{contract.limitationDate ? new Date(contract.limitationDate).toLocaleString() : 'N/A'}</p>
                  </div>
                </div>
              )}
              {contract.type === 'acp' && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Platform Fee</p>
                  <p className="text-sm text-gray-900 font-mono">{contract.platformFee}</p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ContractList; 