const MockV3Aggregator = artifacts.require('MockV3Aggregator')
const MockDAIToken = artifacts.require('MockDAIToken')
const Web3 = require("web3");
const web3 = new Web3(); // Used for toWei

// Removed: var Eth = require('web3-eth');
// Removed: var eth = new Eth(Eth.givenProvider || 'ws://some.local-or-remote.node:8546');

let deployedMockDai = null;
let deployedMockV3Aggregator = null;

const network_configs = {
    sepolia: {
        "dai_usd_price_feed_address": "0x777A68032a88E5A84678A77Af2CD65A7b3c0775a",
        "eth_usd_price_feed_address": "0x9326BFA02ADD2366b30bacB125260Af641031331",
        "link_usd_price_feed_address": "0x396c5E36DD0a0F5a5D33dae44368D4193f69a1F0",
        "fau_usd_price_feed_address": "0x777A68032a88E5A84678A77Af2CD65A7b3c0775a", // Note: Same as DAI on provided Sepolia data
        "dai_token_address": "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD",
        "weth_token_address": "0xd0a1e359811322d97991e03f863a0c30c2cf029c", // This is WETH on Kovan, ensure it's correct for Sepolia or update
        "link_token_address": "0xa36085F69e2889c224210F603D836748e7dC0088", // This is LINK on Kovan, ensure it's correct for Sepolia or update
        "fau_token_address": "0xFab46E002BbF0b4509813474841E0716E6730136", // This is FAU on Kovan, ensure it's correct for Sepolia or update
        "dapp_token_address": "0x984a0522DdF80dC80286e8540479B74548f7013a" // This is a custom DappToken, ensure it's correct for Sepolia or update
    },
    mumbai: {
        "dai_usd_price_feed_address": "/* TODO: Add Mumbai DAI_USD_PRICE_FEED address */",
        "eth_usd_price_feed_address": "/* TODO: Add Mumbai MATIC_USD_PRICE_FEED address */",
        "link_usd_price_feed_address": "/* TODO: Add Mumbai LINK_USD_PRICE_FEED address */",
        "fau_usd_price_feed_address": "/* TODO: Add Mumbai FAU_USD_PRICE_FEED address */",
        "dai_token_address": "/* TODO: Add Mumbai DAI_TOKEN address */",
        "weth_token_address": "/* TODO: Add Mumbai WMATIC_TOKEN address (or WETH) */",
        "link_token_address": "/* TODO: Add Mumbai LINK_TOKEN address */",
        "fau_token_address": "/* TODO: Add Mumbai FAU_TOKEN address */",
        "dapp_token_address": "/* TODO: Add Mumbai DAPP_TOKEN address */"
    },
    polygon: {
        "dai_usd_price_feed_address": "/* TODO: Add Polygon Mainnet DAI_USD_PRICE_FEED address */",
        "eth_usd_price_feed_address": "/* TODO: Add Polygon Mainnet MATIC_USD_PRICE_FEED address */",
        "link_usd_price_feed_address": "/* TODO: Add Polygon Mainnet LINK_USD_PRICE_FEED address */",
        "fau_usd_price_feed_address": "/* TODO: Add Polygon Mainnet FAU_USD_PRICE_FEED address */",
        "dai_token_address": "/* TODO: Add Polygon Mainnet DAI_TOKEN address */",
        "weth_token_address": "/* TODO: Add Polygon Mainnet WMATIC_TOKEN address (or WETH) */",
        "link_token_address": "/* TODO: Add Polygon Mainnet LINK_TOKEN address */",
        "fau_token_address": "/* TODO: Add Polygon Mainnet FAU_TOKEN address */",
        "dapp_token_address": "/* TODO: Add Polygon Mainnet DAPP_TOKEN address */"
    },
    arbitrumOne: {
        "dai_usd_price_feed_address": "/* TODO: Add Arbitrum One DAI_USD_PRICE_FEED address */",
        "eth_usd_price_feed_address": "/* TODO: Add Arbitrum One ETH_USD_PRICE_FEED address */",
        "link_usd_price_feed_address": "/* TODO: Add Arbitrum One LINK_USD_PRICE_FEED address */",
        "fau_usd_price_feed_address": "/* TODO: Add Arbitrum One FAU_USD_PRICE_FEED address */",
        "dai_token_address": "/* TODO: Add Arbitrum One DAI_TOKEN address */",
        "weth_token_address": "/* TODO: Add Arbitrum One WETH_TOKEN address */",
        "link_token_address": "/* TODO: Add Arbitrum One LINK_TOKEN address */",
        "fau_token_address": "/* TODO: Add Arbitrum One FAU_TOKEN address */",
        "dapp_token_address": "/* TODO: Add Arbitrum One DAPP_TOKEN address */"
    },
    arbitrumSepolia: {
        "dai_usd_price_feed_address": "/* TODO: Add Arbitrum Sepolia DAI_USD_PRICE_FEED address */",
        "eth_usd_price_feed_address": "/* TODO: Add Arbitrum Sepolia ETH_USD_PRICE_FEED address */",
        "link_usd_price_feed_address": "/* TODO: Add Arbitrum Sepolia LINK_USD_PRICE_FEED address */",
        "fau_usd_price_feed_address": "/* TODO: Add Arbitrum Sepolia FAU_USD_PRICE_FEED address */",
        "dai_token_address": "/* TODO: Add Arbitrum Sepolia DAI_TOKEN address */",
        "weth_token_address": "/* TODO: Add Arbitrum Sepolia WETH_TOKEN address */",
        "link_token_address": "/* TODO: Add Arbitrum Sepolia LINK_TOKEN address */",
        "fau_token_address": "/* TODO: Add Arbitrum Sepolia FAU_TOKEN address */",
        "dapp_token_address": "/* TODO: Add Arbitrum Sepolia DAPP_TOKEN address */"
    }
};

// Removed: token_address global variable

function toWei(amount){
  return web3.utils.toWei(amount, "ether")
}

const contract_to_mock = {
    "dai_usd_price_feed_address": MockV3Aggregator,
    "dapp_usd_price_feed_address": MockV3Aggregator,
    "eth_usd_price_feed_address": MockV3Aggregator,
    "link_usd_price_feed_address": MockV3Aggregator,
    "fau_usd_price_feed_address": MockV3Aggregator,
    "dai_token_address": MockDAIToken,
    "weth_token_address": MockDAIToken, // Assuming MockDAIToken can represent generic ERC20
    "link_token_address": MockDAIToken, // Assuming MockDAIToken can represent generic ERC20
    "fau_token_address": MockDAIToken,  // Assuming MockDAIToken can represent generic ERC20
    "dapp_token_address": MockDAIToken  // Assuming MockDAIToken can represent generic ERC20
};

const deploy_mocks = async(deployer) =>{
  if (!deployedMockDai) {
    await deployer.deploy(MockDAIToken);
    deployedMockDai = await MockDAIToken.deployed();
  }
  if (!deployedMockV3Aggregator) {
    await deployer.deploy(MockV3Aggregator, 8, 2 * 10**8); // 8 decimals, 200000000 initial answer
    deployedMockV3Aggregator = await MockV3Aggregator.deployed();
  }
  return {
    daiTokenAddress: deployedMockDai.address,
    mockV3AggregatorAddress: deployedMockV3Aggregator.address
  };
};

const get_contract = async(contract_name, current_network, current_deployer)=>{
    let contract_addr;
    const contract_type = contract_to_mock[contract_name];

    if (!contract_type) {
        throw new Error(`Configuration for ${contract_name} not found in contract_to_mock.`);
    }

    if(current_network == "development"){
        // Deploy mocks if not already deployed for the session
        if (!deployedMockDai || !deployedMockV3Aggregator) {
            await deploy_mocks(current_deployer);
        }
        // Return the address of the appropriate mock contract
        if (contract_type.contractName == "MockDAIToken") {
            contract_addr = deployedMockDai.address;
        } else if (contract_type.contractName == "MockV3Aggregator") {
            contract_addr = deployedMockV3Aggregator.address;
        } else {
            throw new Error(`Mock type for ${contract_name} with contract type ${contract_type.contractName} is not recognized for deployment.`);
        }
    }
    else // For Production/Testnets
    {
        if (!network_configs[current_network]) {
            throw new Error(`Network configuration for '${current_network}' not found.`);
        }
        contract_addr = network_configs[current_network][contract_name];
        if (!contract_addr || contract_addr.startsWith("/* TODO:")) {
            throw new Error(`Address for '${contract_name}' on network '${current_network}' is not configured or is a placeholder. Please update helpful_scripts.js.`);
        }
        // Removed: contract = new web3.eth.Contract(contract_type.abi, token_address[contract_name])
        // The function now directly returns the address string.
    }

    if (!contract_addr) {
        throw new Error(`Could not determine address for ${contract_name} on network ${current_network}.`);
    }
    return contract_addr;
};

module.exports = { get_contract, deploy_mocks, contract_to_mock, toWei, network_configs };
