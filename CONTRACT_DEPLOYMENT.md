# Contract Deployment Guide

This guide explains how to deploy and interact with smart contracts in the Mediator dApp.

## Overview

The dApp now supports deploying the `Deal` smart contract, which implements an escrow system with mediation capabilities. The contract allows buyers, sellers, and evaluators to interact with each other in a secure, decentralized manner.

## Contract Features

The `Deal` contract includes the following functions:

- **Constructor**: Initializes the contract with buyer, seller, evaluator, and limitation date
- **deposit**: Allows the buyer to deposit funds into the escrow
- **closeDeal**: Allows the seller to close the deal and receive funds
- **startArbitration**: Allows buyer or seller to start arbitration
- **handleArbitrationResults**: Allows the evaluator to resolve disputes
- **View functions**: Read contract state (buyer, seller, evaluator, limitation date, arbitration status)

## How to Deploy a Contract

### 1. Connect Your Wallet
- Make sure you have a Web3 wallet (like MetaMask) installed
- Connect your wallet to the dApp
- Ensure you're connected to the correct network (Base Sepolia for testing)

### 2. Navigate to Contract Creation
- Go to the "Contract" page in the dApp
- Or click "Deploy New Contract" from the home dashboard

### 3. Fill Out the Form
The contract deployment form requires the following information:

- **Buyer Address**: The Ethereum address of the buyer (0x...)
- **Buyer Email**: Contact email for the buyer
- **Seller Address**: The Ethereum address of the seller (0x...)
- **Seller Email**: Contact email for the seller
- **Evaluator Address**: The Ethereum address of the mediator/evaluator (0x...)
- **Evaluator Email**: Contact email for the evaluator
- **Limitation Date**: The deadline for the contract (must be in the future)

### 4. Deploy the Contract
- Click "Deploy Contract"
- Confirm the transaction in your wallet
- Wait for the transaction to be confirmed on the blockchain
- The contract address will be displayed once deployment is successful

## Contract Interaction

### For Buyers
- **Deposit Funds**: Use the deposit function to send funds to the escrow
- **Start Arbitration**: If there's a dispute, you can start arbitration

### For Sellers
- **Close Deal**: Once the buyer is satisfied, you can close the deal and receive funds
- **Start Arbitration**: If there's a dispute, you can start arbitration

### For Evaluators
- **Handle Arbitration**: When arbitration is active, you can determine the winner and distribute funds

## Viewing Your Contracts

- Go to the home dashboard to see all contracts where you're a participant
- Click "View Details" on any contract to see its current state
- The dashboard shows statistics about your contracts

## Technical Details

### Contract ABI
The contract ABI is located at `src/contracts/Deal.json` and includes:
- Constructor parameters
- All public functions
- View functions for reading contract state

### Deployment Utilities
- `src/app/dapp/utils/contractDeployer.ts`: Handles contract deployment
- `src/app/dapp/utils/contractInteraction.ts`: Handles contract interactions
- `src/app/dapp/utils/contractStorage.ts`: Manages local storage of deployed contracts

### Components
- `src/app/dapp/components/ContractForm.tsx`: Contract deployment form
- `src/app/dapp/components/ContractList.tsx`: Displays deployed contracts
- `src/app/dapp/contract/page.tsx`: Contract creation page

## Security Considerations

- Always verify contract addresses before interacting
- Double-check all addresses and amounts before confirming transactions
- The limitation date is enforced on-chain
- Only authorized parties can perform specific actions (buyer can deposit, seller can close, etc.)

## Troubleshooting

### Common Issues
1. **Transaction Fails**: Ensure you have sufficient ETH for gas fees
2. **Invalid Address**: Make sure all addresses are valid Ethereum addresses (0x...)
3. **Date Error**: Limitation date must be in the future
4. **Wallet Not Connected**: Connect your wallet before deploying

### Error Messages
- "Please connect your wallet first": Connect your Web3 wallet
- "Invalid Ethereum address format": Check address format (0x...)
- "Limitation date must be in the future": Set a future date
- "Deployment failed": Check your wallet for transaction errors

## Network Support

The dApp is configured to work with:
- Base Sepolia (testnet)
- Base (mainnet)
- Ethereum Sepolia (testnet)
- Ethereum Mainnet

Make sure your wallet is connected to the appropriate network for your use case. 