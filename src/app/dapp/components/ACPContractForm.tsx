"use client";

import { useState } from 'react';
import { useAccount, useWalletClient, usePublicClient } from 'wagmi';
import ACPArtifact from '../../../contracts/ACP.json';

const ABI = ACPArtifact.abi;
const BYTECODE = ACPArtifact.bytecode;

export default function ACPContractForm() {
  const [platformFee, setPlatformFee] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [contractAddress, setContractAddress] = useState<string | null>(null);
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const publicClient = usePublicClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setContractAddress(null);
    try {
      if (!walletClient || !address) {
        setMessage('Wallet not connected.');
        setLoading(false);
        return;
      }
      // Deploy contract
      const hash = await walletClient.deployContract({
        abi: ABI,
        bytecode: BYTECODE as `0x${string}`,
        args: [platformFee],
        account: address,
        chain: walletClient.chain,
      });
      setMessage('Transaction sent. Waiting for confirmation...');
      // Wait for confirmation
      // @ts-expect-error: waitForTransactionReceipt is not on walletClient, so use publicClient
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      if (receipt.contractAddress) {
        setContractAddress(receipt.contractAddress);
        setMessage('ACP contract deployed successfully!');
      } else {
        setMessage('Deployment failed.');
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Deployment failed.';
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-full max-w-xl bg-white/80 backdrop-blur rounded-2xl shadow-xl p-8 border border-blue-100">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-100 rounded-full p-3 mb-2">
            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Deploy New ACP Contract</h2>
          <p className="text-gray-500 mt-1 text-center">Deploy a new instance of the ACP contract to Base Sepolia.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Platform Fee <span className="text-xs text-gray-400">(uint256)</span></label>
            <input
              type="number"
              min="0"
              step="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400"
              value={platformFee}
              onChange={e => setPlatformFee(e.target.value)}
              placeholder="Enter platform fee (e.g. 1000)"
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-2.5 px-4 rounded-lg shadow hover:from-blue-700 hover:to-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !platformFee}
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            )}
            {loading ? 'Deploying...' : 'Deploy ACP Contract'}
          </button>
        </form>
        {message && (
          <div className={`mt-6 text-center px-4 py-3 rounded-lg ${contractAddress ? 'bg-green-50 text-green-700 border border-green-200' : message.toLowerCase().includes('fail') || message.toLowerCase().includes('reject') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-200'} break-words max-h-40 overflow-y-auto`}>
            {contractAddress ? (
              <div className="flex flex-col items-center">
                <svg className="w-8 h-8 text-green-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div className="font-semibold">ACP contract deployed successfully!</div>
                <a href={`https://sepolia.basescan.org/address/${contractAddress}`} target="_blank" rel="noopener noreferrer" className="underline break-all mt-1">{contractAddress}</a>
              </div>
            ) : (
              <span>{message}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 