import { useWriteContract, useWaitForTransactionReceipt, useDeployContract } from 'wagmi';
import DealABI from '../../../contracts/Deal.json';

export interface ContractDeploymentParams {
  buyer: string;
  seller: string;
  evaluatorAddress: string;
  limitationDate: bigint;
}

export const useContractDeployment = () => {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const deployContract = async (params: ContractDeploymentParams) => {
    try {
      await writeContract({
        address: '0x0000000000000000000000000000000000000000', // This will be replaced with actual contract address
        abi: DealABI.abi,
        functionName: 'constructor',
        args: [
          params.buyer,
          params.seller,
          params.evaluatorAddress,
          params.limitationDate
        ],
      });
    } catch (err) {
      console.error('Contract deployment failed:', err);
      throw err;
    }
  };

  return {
    deployContract,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error
  };
};

// Contract creation method for deploying new contracts
export const useContractCreation = () => {
  const { deployContract, data: hash, isPending, error } = useDeployContract();
  
  const { isLoading: isConfirming, isSuccess, data: receipt } = useWaitForTransactionReceipt({
    hash,
  });

  const createContract = async (params: ContractDeploymentParams) => {
    try {
      await deployContract({
        abi: DealABI.abi,
        bytecode: DealABI.bytecode as `0x${string}`,
        args: [
          params.buyer,
          params.seller,
          params.evaluatorAddress,
          params.limitationDate
        ],
      });
    } catch (err) {
      console.error('Contract creation failed:', err);
      throw err;
    }
  };

  // Get the deployed contract address from the transaction receipt
  const deployedAddress = receipt?.contractAddress;

  return {
    createContract,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    deployedAddress
  };
}; 