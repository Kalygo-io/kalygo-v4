import { usePublicClient, useAccount } from 'wagmi';
import { type Address, type PublicClient } from 'viem';
import { useCallback } from 'react';
import DealABI from '../../../contracts/Deal.json';
import ACPArtifact from '../../../contracts/ACP.json';

export interface DeployedContract {
  address: string;
  type: 'simple' | 'acp';
  deployedAt: string;
  transactionHash: string;
  // Simple Contract fields
  buyer?: string;
  seller?: string;
  evaluatorAddress?: string;
  limitationDate?: string;
  // ACP Contract fields
  platformFee?: string;
}

const STORAGE_KEY = 'deployed_contracts';

// Custom hook to get deployed contracts
export const useDeployedContracts = () => {
  const publicClient = usePublicClient();
  const { address } = useAccount();

  const getDeployedContracts = useCallback(async (): Promise<DeployedContract[]> => {
    try {
      if (!publicClient) {
        console.error('No public client available');
        return getLocalContracts();
      }

      const localContracts = getLocalContracts();
      
      // Validate and enrich local contracts with blockchain data
      const validatedContracts = await validateContractsFromBlockchain(publicClient, localContracts);
      
      const contracts: DeployedContract[] = [...validatedContracts];

      if (address) {
        const discoveredContracts = await findUserDeployedContracts(publicClient, address);
        contracts.push(...discoveredContracts);
      }
      
      // Remove duplicates based on contract address
      const uniqueContracts = contracts.filter((contract, index, self) => 
        index === self.findIndex(c => c.address.toLowerCase() === contract.address.toLowerCase())
      );
      
      return uniqueContracts;
    } catch (error) {
      console.error('Failed to get deployed contracts:', error);
      return getLocalContracts();
    }
  }, [publicClient, address]);

  const getContractsByAddress = useCallback(async (userAddress: string): Promise<DeployedContract[]> => {
    const allContracts = await getDeployedContracts();
    return allContracts.filter(contract => 
      contract.buyer?.toLowerCase() === userAddress.toLowerCase() ||
      contract.seller?.toLowerCase() === userAddress.toLowerCase() ||
      contract.evaluatorAddress?.toLowerCase() === userAddress.toLowerCase()
    );
  }, [getDeployedContracts]);

  return {
    getDeployedContracts,
    getContractsByAddress,
    publicClient,
    address
  };
};

// Get contracts from localStorage
const getLocalContracts = (): DeployedContract[] => {
  try {
    const contracts = localStorage.getItem(STORAGE_KEY);
    return contracts ? JSON.parse(contracts) : [];
  } catch (error) {
    console.error('Failed to get local contracts:', error);
    return [];
  }
};

// Validate contracts from blockchain and enrich with current data
const validateContractsFromBlockchain = async (publicClient: PublicClient, contracts: DeployedContract[]): Promise<DeployedContract[]> => {
  const validatedContracts: DeployedContract[] = [];
  
  for (const contract of contracts) {
    try {
      const contractData = await readAndIdentifyContract(publicClient, contract.address);
      if (contractData) {
        // Contract exists and is valid
        validatedContracts.push({
          ...contract,
          ...contractData // Update with current blockchain data
        });
      }
    } catch {
      console.warn(`Contract ${contract.address} not found on blockchain, removing from list`);
      // Contract doesn't exist on blockchain, remove it from localStorage
      removeLocalContract(contract.address);
    }
  }
  
  return validatedContracts;
};

const ALCHEMY_RPC = 'https://base-sepolia.g.alchemy.com/v2/kFbROp0TcHRGKsJe7tlMks9lM725n6NC';

interface AlchemyTransfer {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  asset: string;
  category: string;
}

const findUserDeployedContracts = async (publicClient: PublicClient, userAddress: string): Promise<DeployedContract[]> => {
  try {
    const body = (addressParam: 'fromAddress' | 'toAddress') => ({
      id: 1,
      jsonrpc: '2.0',
      method: 'alchemy_getAssetTransfers',
      params: [{
        fromBlock: '0x0',
        toBlock: 'latest',
        [addressParam]: userAddress,
        category: ['external'],
        withMetadata: false, // Keep it simple for contract discovery
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

    const fromTransfers: AlchemyTransfer[] = fromJson.result?.transfers || [];
    const toTransfers: AlchemyTransfer[] = toJson.result?.transfers || [];
    
    // Merge and deduplicate
    const allTransfers = [...fromTransfers, ...toTransfers];
    const uniqueTransfers = allTransfers.filter(
        (tx, index, self) => index === self.findIndex(t => t.hash === tx.hash)
    );
    
    if (uniqueTransfers.length === 0) {
      return [];
    }
    
    // Filter for contract creation transactions
    const creationTransfers = uniqueTransfers.filter(transfer => 
      !transfer.to || transfer.to === '0x'
    );
    
    if (creationTransfers.length === 0) {
      return [];
    }
    
    return await processAlchemyTransfersForContracts(publicClient, creationTransfers);

  } catch (error) {
    console.error('Error finding user-deployed contracts via Alchemy:', error);
    return [];
  }
};

const processAlchemyTransfersForContracts = async (publicClient: PublicClient, transfers: AlchemyTransfer[]): Promise<DeployedContract[]> => {
  const contracts: DeployedContract[] = [];
  
  for (const transfer of transfers) {
    try {
      // Get transaction receipt to find contract address
      const receipt = await publicClient.getTransactionReceipt({ 
        hash: transfer.hash as `0x${string}` 
      });
      
      if (receipt && receipt.contractAddress) {
        // Try to read contract data to verify it's a known contract type
        const contractData = await readAndIdentifyContract(publicClient, receipt.contractAddress);
        
        if (contractData) {
          // Get block info for timestamp
          const block = await publicClient.getBlock({ blockHash: receipt.blockHash });
          
          contracts.push({
            address: receipt.contractAddress,
            deployedAt: new Date(Number(block.timestamp) * 1000).toISOString(),
            transactionHash: receipt.transactionHash,
            ...contractData,
          } as DeployedContract);
        }
      }
    } catch (error) {
      console.warn(`Failed to process transfer ${transfer.hash}:`, error);
      // Continue with other transfers
    }
  }
  
  return contracts;
};

// Read contract data from a deployed contract address
const readAndIdentifyContract = async (publicClient: PublicClient, contractAddress: string): Promise<Partial<DeployedContract> | null> => {
  const simpleData = await readSimpleContractData(publicClient, contractAddress);
  if (simpleData) return simpleData;

  const acpData = await readAcpContractData(publicClient, contractAddress);
  if (acpData) return acpData;

  return null;
}

const readSimpleContractData = async (publicClient: PublicClient, contractAddress: string): Promise<Partial<DeployedContract> | null> => {
  try {
    // Try to read contract data using the Deal ABI
    const [buyer, seller, evaluatorAddress, limitationDate] = await Promise.all([
      publicClient.readContract({
        address: contractAddress as Address,
        abi: DealABI.abi,
        functionName: 'buyer',
      }),
      publicClient.readContract({
        address: contractAddress as Address,
        abi: DealABI.abi,
        functionName: 'seller',
      }),
      publicClient.readContract({
        address: contractAddress as Address,
        abi: DealABI.abi,
        functionName: 'evaluatorAddress',
      }),
      publicClient.readContract({
        address: contractAddress as Address,
        abi: DealABI.abi,
        functionName: 'limitationDate',
      }),
    ]);
    
    return {
      type: 'simple',
      buyer: buyer as string,
      seller: seller as string,
      evaluatorAddress: evaluatorAddress as string,
      limitationDate: new Date(Number(limitationDate) * 1000).toISOString(),
    };
  } catch {
    // Contract might not be our Deal contract or might not exist
    return null;
  }
};

const readAcpContractData = async (publicClient: PublicClient, contractAddress: string): Promise<Partial<DeployedContract> | null> => {
  try {
    const platformFee = await publicClient.readContract({
      address: contractAddress as Address,
      abi: ACPArtifact.abi,
      functionName: 'platformFee',
    });
    return {
      type: 'acp',
      platformFee: (platformFee as bigint).toString(),
    };
  } catch {
    return null;
  }
};

// Remove contract from localStorage
const removeLocalContract = (address: string) => {
  try {
    const existingContracts = getLocalContracts();
    const updatedContracts = existingContracts.filter(contract => contract.address !== address);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedContracts));
  } catch (error) {
    console.error('Failed to remove local contract:', error);
  }
};

// Save deployed contract to localStorage and blockchain
export const saveDeployedContract = (contract: DeployedContract) => {
  try {
    const existingContracts = getLocalContracts();
    const updatedContracts = [...existingContracts, contract];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedContracts));
    console.log('Contract saved locally:', contract);
  } catch (error) {
    console.error('Failed to save deployed contract:', error);
  }
};

// Remove deployed contract from localStorage
export const removeDeployedContract = (address: string) => {
  removeLocalContract(address);
  console.log('Contract removed from local storage:', address);
}; 