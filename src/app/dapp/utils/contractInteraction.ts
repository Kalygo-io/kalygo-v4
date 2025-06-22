import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import DealABI from '../../../contracts/Deal.json';

export interface ContractState {
  buyer: string;
  seller: string;
  evaluatorAddress: string;
  limitationDate: bigint;
  arbitrationFlag: boolean;
}

export const useContractRead = (contractAddress: string) => {
  const { data: buyer, isLoading: buyerLoading } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: DealABI.abi,
    functionName: 'buyer',
  });

  const { data: seller, isLoading: sellerLoading } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: DealABI.abi,
    functionName: 'seller',
  });

  const { data: evaluatorAddress, isLoading: evaluatorLoading } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: DealABI.abi,
    functionName: 'evaluatorAddress',
  });

  const { data: limitationDate, isLoading: limitationLoading } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: DealABI.abi,
    functionName: 'limitationDate',
  });

  const { data: arbitrationFlag, isLoading: arbitrationLoading } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: DealABI.abi,
    functionName: 'arbitrationFlag',
  });

  const isLoading = buyerLoading || sellerLoading || evaluatorLoading || limitationLoading || arbitrationLoading;

  const contractState: ContractState | null = isLoading ? null : {
    buyer: buyer as string,
    seller: seller as string,
    evaluatorAddress: evaluatorAddress as string,
    limitationDate: limitationDate as bigint,
    arbitrationFlag: arbitrationFlag as boolean,
  };

  return {
    contractState,
    isLoading,
  };
};

export const useContractActions = (contractAddress: string) => {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const deposit = async (value: bigint) => {
    try {
      await writeContract({
        address: contractAddress as `0x${string}`,
        abi: DealABI.abi,
        functionName: 'deposit',
        value,
      });
    } catch (err) {
      console.error('Deposit failed:', err);
      throw err;
    }
  };

  const closeDeal = async () => {
    try {
      await writeContract({
        address: contractAddress as `0x${string}`,
        abi: DealABI.abi,
        functionName: 'closeDeal',
      });
    } catch (err) {
      console.error('Close deal failed:', err);
      throw err;
    }
  };

  const startArbitration = async () => {
    try {
      await writeContract({
        address: contractAddress as `0x${string}`,
        abi: DealABI.abi,
        functionName: 'startArbitration',
      });
    } catch (err) {
      console.error('Start arbitration failed:', err);
      throw err;
    }
  };

  const handleArbitrationResults = async (winner: string) => {
    try {
      await writeContract({
        address: contractAddress as `0x${string}`,
        abi: DealABI.abi,
        functionName: 'handleArbitrationResults',
        args: [winner],
      });
    } catch (err) {
      console.error('Handle arbitration results failed:', err);
      throw err;
    }
  };

  return {
    deposit,
    closeDeal,
    startArbitration,
    handleArbitrationResults,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}; 