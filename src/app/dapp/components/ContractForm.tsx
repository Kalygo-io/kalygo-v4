"use client";

import { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'react-toastify';
import { useContractCreation, ContractDeploymentParams } from '../utils/contractDeployer';
import { saveDeployedContract, DeployedContract } from '../utils/contractStorage';

const ContractForm = () => {
  const { isConnected } = useAccount();
  const { createContract, isPending, isConfirming, isSuccess, error, hash, deployedAddress } = useContractCreation();
  
  const [formData, setFormData] = useState({
    buyerAddress: '0x724C92f5385C5A4D167b07e3246aE4704E65cf6C',
    buyerEmail: 'tad@cmdlabs.io',
    sellerAddress: '0x724C92f5385C5A4D167b07e3246aE4704E65cf6C',
    sellerEmail: 'tad@cmdlabs.io',
    evaluatorAddress: '0x724C92f5385C5A4D167b07e3246aE4704E65cf6C',
    evaluatorEmail: 'tad@cmdlabs.io',
    limitationDate: ''
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const submittedData = useRef<typeof formData | null>(null);

  // Save contract to storage when deployment is successful
  useEffect(() => {
    if (isSuccess && hash && deployedAddress && submittedData.current) {
      const contractData: DeployedContract = {
        address: deployedAddress,
        deployedAt: new Date().toISOString(),
        transactionHash: hash,
        buyer: submittedData.current.buyerAddress,
        seller: submittedData.current.sellerAddress,
        evaluatorAddress: submittedData.current.evaluatorAddress,
        limitationDate: submittedData.current.limitationDate,
      };
      
      saveDeployedContract(contractData);
      toast.success(`Contract deployed successfully at ${deployedAddress}`);
      
      // Reset form after successful deployment
      setFormData({
        buyerAddress: '0x724C92f5385C5A4D167b07e3246aE4704E65cf6C',
        buyerEmail: 'tad@cmdlabs.io',
        sellerAddress: '0x724C92f5385C5A4D167b07e3246aE4704E65cf6C',
        sellerEmail: 'tad@cmdlabs.io',
        evaluatorAddress: '0x724C92f5385C5A4D167b07e3246aE4704E65cf6C',
        evaluatorEmail: 'tad@cmdlabs.io',
        limitationDate: ''
      });
      submittedData.current = null;
    }
  }, [isSuccess, hash, deployedAddress]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Ethereum address validation
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;
    
    if (!formData.buyerAddress) {
      errors.buyerAddress = 'Buyer address is required';
    } else if (!addressRegex.test(formData.buyerAddress)) {
      errors.buyerAddress = 'Invalid Ethereum address format';
    }
    
    if (!formData.sellerAddress) {
      errors.sellerAddress = 'Seller address is required';
    } else if (!addressRegex.test(formData.sellerAddress)) {
      errors.sellerAddress = 'Invalid Ethereum address format';
    }
    
    if (!formData.evaluatorAddress) {
      errors.evaluatorAddress = 'Evaluator address is required';
    } else if (!addressRegex.test(formData.evaluatorAddress)) {
      errors.evaluatorAddress = 'Invalid Ethereum address format';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.buyerEmail) {
      errors.buyerEmail = 'Buyer email is required';
    } else if (!emailRegex.test(formData.buyerEmail)) {
      errors.buyerEmail = 'Invalid email format';
    }
    
    if (!formData.sellerEmail) {
      errors.sellerEmail = 'Seller email is required';
    } else if (!emailRegex.test(formData.sellerEmail)) {
      errors.sellerEmail = 'Invalid email format';
    }
    
    if (!formData.evaluatorEmail) {
      errors.evaluatorEmail = 'Evaluator email is required';
    } else if (!emailRegex.test(formData.evaluatorEmail)) {
      errors.evaluatorEmail = 'Invalid email format';
    }
    
    // Date validation
    if (!formData.limitationDate) {
      errors.limitationDate = 'Limitation date is required';
    } else {
      const selectedDate = new Date(formData.limitationDate);
      const now = new Date();
      if (selectedDate <= now) {
        errors.limitationDate = 'Limitation date must be in the future';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }
    
    submittedData.current = formData;
    
    try {
      const limitationDate = BigInt(Math.floor(new Date(formData.limitationDate).getTime() / 1000));
      
      const params: ContractDeploymentParams = {
        buyer: formData.buyerAddress,
        seller: formData.sellerAddress,
        evaluatorAddress: formData.evaluatorAddress,
        limitationDate
      };
      
      await createContract(params);
      toast.success('Contract deployment initiated!');
    } catch (err) {
      console.error('Deployment error:', err);
      toast.error('Failed to deploy contract. Please try again.');
    }
  };

  // Show error message if deployment fails
  if (error) {
    toast.error(`Deployment failed: ${error.message}`);
  }
    
  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <label htmlFor="buyer-address" className="block text-sm font-medium text-gray-700 mb-1">
            Buyer Address *
          </label>
          <input
            type="text"
            id="buyer-address"
            placeholder="0x..."
            value={formData.buyerAddress}
            onChange={(e) => handleInputChange('buyerAddress', e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
              validationErrors.buyerAddress ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {validationErrors.buyerAddress && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.buyerAddress}</p>
          )}
        </div>
        <div>
          <label htmlFor="buyer-email" className="block text-sm font-medium text-gray-700 mb-1">
            Buyer Email *
          </label>
          <input
            type="email"
            id="buyer-email"
            placeholder="buyer@example.com"
            value={formData.buyerEmail}
            onChange={(e) => handleInputChange('buyerEmail', e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
              validationErrors.buyerEmail ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {validationErrors.buyerEmail && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.buyerEmail}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <label htmlFor="seller-address" className="block text-sm font-medium text-gray-700 mb-1">
            Seller Address *
          </label>
          <input
            type="text"
            id="seller-address"
            placeholder="0x..."
            value={formData.sellerAddress}
            onChange={(e) => handleInputChange('sellerAddress', e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
              validationErrors.sellerAddress ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {validationErrors.sellerAddress && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.sellerAddress}</p>
          )}
        </div>
        <div>
          <label htmlFor="seller-email" className="block text-sm font-medium text-gray-700 mb-1">
            Seller Email *
          </label>
          <input
            type="email"
            id="seller-email"
            placeholder="seller@example.com"
            value={formData.sellerEmail}
            onChange={(e) => handleInputChange('sellerEmail', e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
              validationErrors.sellerEmail ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {validationErrors.sellerEmail && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.sellerEmail}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <label htmlFor="evaluator-address" className="block text-sm font-medium text-gray-700 mb-1">
            Evaluator Address *
          </label>
          <input
            type="text"
            id="evaluator-address"
            placeholder="0x..."
            value={formData.evaluatorAddress}
            onChange={(e) => handleInputChange('evaluatorAddress', e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
              validationErrors.evaluatorAddress ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {validationErrors.evaluatorAddress && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.evaluatorAddress}</p>
          )}
        </div>
        <div>
          <label htmlFor="evaluator-email" className="block text-sm font-medium text-gray-700 mb-1">
            Evaluator Email *
          </label>
          <input
            type="email"
            id="evaluator-email"
            placeholder="evaluator@example.com"
            value={formData.evaluatorEmail}
            onChange={(e) => handleInputChange('evaluatorEmail', e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
              validationErrors.evaluatorEmail ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {validationErrors.evaluatorEmail && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.evaluatorEmail}</p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="limitation-date" className="block text-sm font-medium text-gray-700 mb-1">
          Limitation Date *
        </label>
        <input
          type="datetime-local"
          id="limitation-date"
          value={formData.limitationDate}
          onChange={(e) => handleInputChange('limitationDate', e.target.value)}
          className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
            validationErrors.limitationDate ? 'border-red-500' : 'border-gray-300'
          } ${!formData.limitationDate ? 'text-gray-500' : 'text-gray-900'}`}
        />
        {validationErrors.limitationDate && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.limitationDate}</p>
        )}
      </div>

      {!isConnected && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800 text-sm">
            Please connect your wallet to deploy a contract.
          </p>
        </div>
      )}

      <button 
        type="submit"
        disabled={!isConnected || isPending || isConfirming}
        className={`w-full py-3 rounded-md transition-colors ${
          !isConnected || isPending || isConfirming
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white`}
      >
        {isPending ? 'Deploying...' : isConfirming ? 'Confirming...' : 'Deploy Contract'}
      </button>
    </form>
  );
};

export default ContractForm; 