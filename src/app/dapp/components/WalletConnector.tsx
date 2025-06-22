"use client";

import { useAccount, useConnect, useDisconnect, useEnsName, useBalance } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useState } from 'react';
import { type UseBalanceReturnType } from 'wagmi';

export default function WalletConnector() {
    const { address, isConnected } = useAccount();
    const { data: ensName } = useEnsName({ address });
    const { connect } = useConnect();
    const { disconnect } = useDisconnect({
        mutation: {
            onSuccess() {
                setIsDropdownOpen(false);
            },
        }
    });
    const { data: balance } = useBalance({ address });

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    const formatBalance = (bal: UseBalanceReturnType['data']) => {
        if (!bal) return '0.00';
        const formatted = parseFloat(bal.formatted).toFixed(4);
        return `${formatted} ${bal.symbol}`;
    };

    if (isConnected) {
        return (
            <div className="relative">
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-full transition-colors duration-200"
                >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center text-white font-bold">
                        {ensName ? ensName.charAt(0) : ``}
                    </div>
                    <div className="text-left">
                        <div className="text-sm font-medium">{ensName || formatAddress(address!)}</div>
                        <div className="text-xs text-gray-500">{formatBalance(balance)}</div>
                    </div>
                    <svg className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>

                </button>

                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                        <button
                            onClick={() => disconnect()}
                            className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Disconnect
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <button
            onClick={() => connect({ connector: injected() })}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200"
        >
            Connect Wallet
        </button>
    );
}