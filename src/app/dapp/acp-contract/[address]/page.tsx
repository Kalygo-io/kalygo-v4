"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAccount, usePublicClient } from 'wagmi';
import { type Address } from 'viem';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import ACPArtifact from '../../../../contracts/ACP.json';

interface ACPContractState {
  platformFee: string;
  platformOwner: string;
}

const ACPContractDetailsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [contractState, setContractState] = useState<ACPContractState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const params = useParams();
  const contractAddress = params.address as string;
  const { address } = useAccount();
  const publicClient = usePublicClient();

  useEffect(() => {
    const loadContractState = async () => {
      if (!publicClient || !contractAddress) {
        setError('No public client or contract address available');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const [platformFee, platformOwner] = await Promise.all([
          publicClient.readContract({
            address: contractAddress as Address,
            abi: ACPArtifact.abi,
            functionName: 'platformFee',
          }),
          publicClient.readContract({
            address: contractAddress as Address,
            abi: ACPArtifact.abi,
            functionName: 'platformOwner',
          }),
        ]);

        setContractState({
          platformFee: (platformFee as bigint).toString(),
          platformOwner: platformOwner as string,
        });
      } catch (err) {
        console.error('Failed to load ACP contract state:', err);
        setError('Failed to load contract details');
      } finally {
        setIsLoading(false);
      }
    };

    loadContractState();
  }, [publicClient, contractAddress]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ACP contract details...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-red-600">Failed to load contract details</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
        </div>
      );
    }

    if (!contractState) {
      return (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-red-600">No contract data available</h3>
        </div>
      );
    }

    const isPlatformOwner = address?.toLowerCase() === contractState.platformOwner.toLowerCase();

    return (
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-purple-100 text-purple-800">
            ACP Contract
          </span>
          <h2 className="text-2xl font-bold text-gray-900">Contract Details</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="break-all">
            <p className="text-sm font-medium text-gray-500">Contract Address</p>
            <p className="text-md text-gray-900 font-mono">{contractAddress}</p>
          </div>
          <div className="break-all">
            <p className="text-sm font-medium text-gray-500">Platform Owner</p>
            <p className="text-md text-gray-900 font-mono">{contractState.platformOwner}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Platform Fee</p>
            <p className="text-md text-gray-900 font-mono">{contractState.platformFee} wei</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Your Role</p>
            <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
              isPlatformOwner 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {isPlatformOwner ? 'Platform Owner' : 'User'}
            </span>
          </div>
        </div>

        {isPlatformOwner && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Owner Actions</h3>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-yellow-800 mb-2">Update Platform Fee</h4>
                <p className="text-sm text-yellow-700 mb-3">
                  As the platform owner, you can update the platform fee.
                </p>
                <button
                  disabled
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 pt-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">About ACP Contracts</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700 mb-3">
              ACP (Arbitration and Contract Platform) contracts provide a decentralized platform for managing 
              jobs, escrow, and arbitration processes.
            </p>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Job creation and management with escrow functionality</li>
              <li>Multi-phase job workflows with approval mechanisms</li>
              <li>Memo-based communication and documentation</li>
              <li>Arbitration and dispute resolution</li>
              <li>Platform fee collection and management</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">ACP Contract Details</h1>
              <p className="text-gray-600">View and manage ACP contract state and settings.</p>
            </div>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ACPContractDetailsPage; 