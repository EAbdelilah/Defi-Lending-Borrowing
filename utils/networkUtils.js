export const getExplorerLink = (networkId, transactionHash) => {
  if (!networkId || !transactionHash) {
    return null;
  }

  switch (Number(networkId)) {
    case 1: // Ethereum Mainnet
      return `https://etherscan.io/tx/${transactionHash}`;
    case 11155111: // Sepolia Testnet
      return `https://sepolia.etherscan.io/tx/${transactionHash}`;
    case 137: // Polygon Mainnet
      return `https://polygonscan.com/tx/${transactionHash}`;
    case 80001: // Polygon Mumbai Testnet
      return `https://mumbai.polygonscan.com/tx/${transactionHash}`;
    case 42161: // Arbitrum Mainnet
      return `https://arbiscan.io/tx/${transactionHash}`;
    case 421613: // Arbitrum Goerli Testnet
      return `https://goerli.arbiscan.io/tx/${transactionHash}`;
    case 5777: // Common Ganache ID
    case 1337: // Other common Ganache ID
      console.warn(`Local network (ID: ${networkId}) selected. No specific block explorer link generated, returning hash for info.`);
      return `Transaction Hash (Local Network): ${transactionHash}`; // Or return null if preferred
    default:
      console.warn(`Unsupported network ID: ${networkId} for block explorer link.`);
      return null;
  }
};
