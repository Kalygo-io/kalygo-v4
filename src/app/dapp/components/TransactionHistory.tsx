"use client";

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface Transaction {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  blockNum: string;
  category: string;
  asset: string;
  metadata: {
    blockTimestamp: string;
  };
}

interface TransactionHistoryProps {
  searchTerm: string;
  statusFilter: string;
}

const ALCHEMY_RPC = 'https://base-sepolia.g.alchemy.com/v2/kFbROp0TcHRGKsJe7tlMks9lM725n6NC';

export default function TransactionHistory({ searchTerm, statusFilter }: TransactionHistoryProps) {
  const { address } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setTransactions([]);
      return;
    }

    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const body = (addressParam: 'fromAddress' | 'toAddress') => ({
          id: 1,
          jsonrpc: '2.0',
          method: 'alchemy_getAssetTransfers',
          params: [{
            fromBlock: '0x0',
            toBlock: 'latest',
            [addressParam]: address,
            category: ['external'],
            withMetadata: true,
            excludeZeroValue: false,
            maxCount: '0x64', // 100 transactions
            order: 'desc'
          }],
        });

        const fromPromise = fetch(ALCHEMY_RPC, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body('fromAddress')),
        });

        const toPromise = fetch(ALCHEMY_RPC, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body('toAddress')),
        });
        
        const [fromRes, toRes] = await Promise.all([fromPromise, toPromise]);

        const fromJson = await fromRes.json();
        const toJson = await toRes.json();

        if (fromJson.error) throw new Error(`Alchemy RPC Error (from): ${fromJson.error.message}`);
        if (toJson.error) throw new Error(`Alchemy RPC Error (to): ${toJson.error.message}`);

        const fromTransfers: Transaction[] = fromJson.result?.transfers || [];
        const toTransfers: Transaction[] = toJson.result?.transfers || [];
        
        // Merge and deduplicate
        const allTransfers = [...fromTransfers, ...toTransfers];
        const uniqueTransfers = allTransfers.filter(
            (tx, index, self) => index === self.findIndex(t => t.hash === tx.hash)
        );

        // Sort by block number descending
        uniqueTransfers.sort((a, b) => parseInt(b.blockNum, 16) - parseInt(a.blockNum, 16));

        setTransactions(uniqueTransfers);

      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [address]);

  const formatValue = (value: string, asset: string) => {
    if (asset === 'ETH') {
      const ethValue = parseFloat(value) / Math.pow(10, 18);
      return `${ethValue.toFixed(6)} ETH`;
    }
    return `${value} ${asset}`;
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getTransactionType = (transaction: Transaction) => {
    if (!transaction.to) return 'Contract Creation';
    return 'Transfer';
  };

  const getTransactionStatus = () => {
    // For now, assume all transactions are completed since they're from history
    return 'completed';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Contract Creation':
        return 'bg-purple-100 text-purple-800';
      case 'Transfer':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.to && transaction.to.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || getTransactionStatus() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
        </div>
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading transactions</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
        </div>
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Please connect your wallet</h3>
          <p className="mt-1 text-sm text-gray-500">Connect your wallet to view transaction history.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
        <p className="text-sm text-gray-500 mt-1">
          Showing {filteredTransactions.length} of {transactions.length} transactions for {formatAddress(address)}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction Hash
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                From
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.hash} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <a 
                    href={`https://sepolia.basescan.org/tx/${transaction.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {formatAddress(transaction.hash)}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(getTransactionType(transaction))}`}>
                    {getTransactionType(transaction)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatAddress(transaction.from)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.to ? formatAddress(transaction.to) : 'Contract Creation'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatValue(transaction.value, transaction.asset)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(getTransactionStatus())}`}>
                    {getTransactionStatus().charAt(0).toUpperCase() + getTransactionStatus().slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatTimestamp(transaction.metadata.blockTimestamp)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredTransactions.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
} 