require('babel-register');
require('babel-polyfill');
const path = require("path");
const HDWalletProvider = require('./node_modules/@truffle/hdwallet-provider'); // Keeping existing import path
require('./node_modules/dotenv').config();

// Environment variable validation can be done here or within each provider function.
// For clarity, basic checks are included in provider functions.

// Ensure these are declared in your .env file:
//
// For Sepolia:
// SEPOLIA_PRIVATE_KEY="YOUR_SEPOLIA_PRIVATE_KEY"
// INFURA_API_KEY="YOUR_INFURA_API_KEY" (or your specific Sepolia RPC URL provider's key)
//
// For Polygon Mainnet:
// POLYGON_MAINNET_PRIVATE_KEY="YOUR_POLYGON_MAINNET_PRIVATE_KEY"
// POLYGON_MAINNET_RPC_URL="YOUR_POLYGON_MAINNET_RPC_URL"
//
// For Polygon Mumbai Testnet:
// POLYGON_MUMBAI_PRIVATE_KEY="YOUR_POLYGON_MUMBAI_PRIVATE_KEY"
// POLYGON_MUMBAI_RPC_URL="YOUR_POLYGON_MUMBAI_RPC_URL"
//
// For Arbitrum One Mainnet:
// ARBITRUM_ONE_PRIVATE_KEY="YOUR_ARBITRUM_ONE_PRIVATE_KEY"
// ARBITRUM_ONE_RPC_URL="YOUR_ARBITRUM_ONE_RPC_URL"
//
// For Arbitrum Sepolia Testnet:
// ARBITRUM_SEPOLIA_PRIVATE_KEY="YOUR_ARBITRUM_SEPOLIA_PRIVATE_KEY"
// ARBITRUM_SEPOLIA_RPC_URL="YOUR_ARBITRUM_SEPOLIA_RPC_URL"
// ARBISCAN_API_KEY="YOUR_ARBISCAN_API_KEY" (Optional, for contract verification)

// Removed: const MNEMONIC = process.env.MNEMONIC;
// Removed: const INFURA_API_KEY = process.env.INFURA_API_KEY; // Defined locally or used directly

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
      gasPrice: 25000000000
    },
    sepolia: {
      provider: function(){
        if (!process.env.SEPOLIA_PRIVATE_KEY || !process.env.INFURA_API_KEY) {
          throw new Error("SEPOLIA_PRIVATE_KEY and INFURA_API_KEY must be set in .env for Sepolia network.");
        }
        return new HDWalletProvider(
          process.env.SEPOLIA_PRIVATE_KEY,
          `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`
        );
      },
      gas_price: 25000000000, // Consider adjusting gas price based on network conditions
      network_id: 11155111
    },
    polygon: {
      provider: () => {
        if (!process.env.POLYGON_MAINNET_PRIVATE_KEY || !process.env.POLYGON_MAINNET_RPC_URL) {
          throw new Error("POLYGON_MAINNET_PRIVATE_KEY and POLYGON_MAINNET_RPC_URL must be set in .env for Polygon Mainnet.");
        }
        return new HDWalletProvider(
          process.env.POLYGON_MAINNET_PRIVATE_KEY,
          process.env.POLYGON_MAINNET_RPC_URL
        );
      },
      network_id: 137,
      gasPrice: 50000000000, // Adjust as needed
      // confirmations: 2,
      // timeoutBlocks: 200,
      // skipDryRun: true
    },
    mumbai: {
      provider: () => {
        if (!process.env.POLYGON_MUMBAI_PRIVATE_KEY || !process.env.POLYGON_MUMBAI_RPC_URL) {
          throw new Error("POLYGON_MUMBAI_PRIVATE_KEY and POLYGON_MUMBAI_RPC_URL must be set in .env for Mumbai Testnet.");
        }
        return new HDWalletProvider(
          process.env.POLYGON_MUMBAI_PRIVATE_KEY,
          process.env.POLYGON_MUMBAI_RPC_URL
        );
      },
      network_id: 80001,
      gasPrice: 35000000000, // Adjust as needed
      // confirmations: 2,
      // timeoutBlocks: 200,
      // skipDryRun: true
    },
    arbitrumOne: {
      provider: () => {
        if (!process.env.ARBITRUM_ONE_PRIVATE_KEY || !process.env.ARBITRUM_ONE_RPC_URL) {
          throw new Error("ARBITRUM_ONE_PRIVATE_KEY and ARBITRUM_ONE_RPC_URL must be set in .env for Arbitrum One.");
        }
        return new HDWalletProvider(
          process.env.ARBITRUM_ONE_PRIVATE_KEY,
          process.env.ARBITRUM_ONE_RPC_URL
        );
      },
      network_id: 42161,
      // gasPrice and blockGasLimit might need specific settings for Arbitrum
    },
    arbitrumSepolia: {
      provider: () => {
        if (!process.env.ARBITRUM_SEPOLIA_PRIVATE_KEY || !process.env.ARBITRUM_SEPOLIA_RPC_URL) {
          throw new Error("ARBITRUM_SEPOLIA_PRIVATE_KEY and ARBITRUM_SEPOLIA_RPC_URL must be set in .env for Arbitrum Sepolia.");
        }
        return new HDWalletProvider(
          process.env.ARBITRUM_SEPOLIA_PRIVATE_KEY,
          process.env.ARBITRUM_SEPOLIA_RPC_URL
        );
      },
      network_id: 421614,
      // verify: { // Optional: Configuration for block explorer verification
      //   apiUrl: 'https://api-sepolia.arbiscan.io/api',
      //   apiKey: process.env.ARBISCAN_API_KEY, // Ensure ARBISCAN_API_KEY is in .env
      //   explorerUrl: 'https://sepolia.arbiscan.io/address/<address>',
      // }
    }
  },
  contracts_directory: './contracts/',
  contracts_build_directory: './abis/',
  compilers: {
    solc: {
      version: "^0.8.6",
      settings: {
        evmVersion: 'byzantium',
        optimizer: {
          enabled: true,
          runs: 1
        }
      }
    }
  },
  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions : { // Optional
      currency: 'USD',
      gasPrice: 21 // Optional
    }
  },
  plugins: ["truffle-contract-size"]
};
