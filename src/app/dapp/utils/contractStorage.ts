export interface DeployedContract {
  address: string;
  deployedAt: string;
  transactionHash: string;
  buyer: string;
  seller: string;
  evaluatorAddress: string;
  limitationDate: string;
}

const STORAGE_KEY = 'deployed_contracts';

export const saveDeployedContract = (contract: DeployedContract) => {
  try {
    const existingContracts = getDeployedContracts();
    const updatedContracts = [...existingContracts, contract];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedContracts));
  } catch (error) {
    console.error('Failed to save deployed contract:', error);
  }
};

export const getDeployedContracts = (): DeployedContract[] => {
  try {
    const contracts = localStorage.getItem(STORAGE_KEY);
    return contracts ? JSON.parse(contracts) : [];
  } catch (error) {
    console.error('Failed to get deployed contracts:', error);
    return [];
  }
};

export const removeDeployedContract = (address: string) => {
  try {
    const existingContracts = getDeployedContracts();
    const updatedContracts = existingContracts.filter(contract => contract.address !== address);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedContracts));
  } catch (error) {
    console.error('Failed to remove deployed contract:', error);
  }
};

export const getContractsByAddress = (userAddress: string): DeployedContract[] => {
  const allContracts = getDeployedContracts();
  return allContracts.filter(contract => 
    contract.buyer.toLowerCase() === userAddress.toLowerCase() ||
    contract.seller.toLowerCase() === userAddress.toLowerCase() ||
    contract.evaluatorAddress.toLowerCase() === userAddress.toLowerCase()
  );
}; 