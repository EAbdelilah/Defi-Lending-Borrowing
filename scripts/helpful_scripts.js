const MockV3Aggregator = artifacts.require('MockV3Aggregator')
const MockDAIToken = artifacts.require('MockDAIToken')
const Web3 = require("web3");
const web3 = new Web3();
var Eth = require('web3-eth');
var eth = new Eth(Eth.givenProvider || 'ws://some.local-or-remote.node:8546');

let deployed = false;
let tokenDai = {} ;
let mockV3 = {};

const network_configs = {
    sepolia: {
        "dai_usd_price_feed_address": '0x777A68032a88E5A84678A77Af2CD65A7b3c0775a',
        "eth_usd_price_feed_address": '0x9326BFA02ADD2366b30bacB125260Af641031331',
        "link_usd_price_feed_address": '0x396c5E36DD0a0F5a5D33dae44368D4193f69a1F0',
        "fau_usd_price_feed_address": '0x777A68032a88E5A84678A77Af2CD65A7b3c0775a', // Assuming FAU uses DAI price feed on Sepolia
        "dai_token_address": '0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD',
        "weth_token_address": '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
        "link_token_address": '0xa36085F69e2889c224210F603D836748e7dC0088',
        "fau_token_address": '0xFab46E002BbF0b4509813474841E0716E6730136',
        "dapp_token_address": '0x984a0522DdF80dC80286e8540479B74548f7013a' // This will be set during deployment
    },
    polygon_mainnet: {
        "dai_usd_price_feed_address": 'PLACEHOLDER_POLYGON_MAINNET_DAI_USD_PRICE_FEED',
        "eth_usd_price_feed_address": 'PLACEHOLDER_POLYGON_MAINNET_MATIC_USD_PRICE_FEED', // MATIC price feed
        "link_usd_price_feed_address": 'PLACEHOLDER_POLYGON_MAINNET_LINK_USD_PRICE_FEED',
        "fau_usd_price_feed_address": 'PLACEHOLDER_POLYGON_MAINNET_FAU_USD_PRICE_FEED',
        "dai_token_address": 'PLACEHOLDER_POLYGON_MAINNET_DAI_TOKEN',
        "weth_token_address": 'PLACEHOLDER_POLYGON_MAINNET_WETH_TOKEN', // Or WMATIC
        "link_token_address": 'PLACEHOLDER_POLYGON_MAINNET_LINK_TOKEN',
        "fau_token_address": 'PLACEHOLDER_POLYGON_MAINNET_FAU_TOKEN',
        "dapp_token_address": 'PLACEHOLDER_POLYGON_MAINNET_DAPP_TOKEN_ADDRESS' // This will be set during deployment
    },
    polygon_mumbai: {
        "dai_usd_price_feed_address": 'PLACEHOLDER_POLYGON_MUMBAI_DAI_USD_PRICE_FEED',
        "eth_usd_price_feed_address": 'PLACEHOLDER_POLYGON_MUMBAI_MATIC_USD_PRICE_FEED', // MATIC price feed
        "link_usd_price_feed_address": 'PLACEHOLDER_POLYGON_MUMBAI_LINK_USD_PRICE_FEED',
        "fau_usd_price_feed_address": 'PLACEHOLDER_POLYGON_MUMBAI_FAU_USD_PRICE_FEED',
        "dai_token_address": 'PLACEHOLDER_POLYGON_MUMBAI_DAI_TOKEN',
        "weth_token_address": 'PLACEHOLDER_POLYGON_MUMBAI_WETH_TOKEN', // Or WMATIC
        "link_token_address": 'PLACEHOLDER_POLYGON_MUMBAI_LINK_TOKEN',
        "fau_token_address": 'PLACEHOLDER_POLYGON_MUMBAI_FAU_TOKEN',
        "dapp_token_address": 'PLACEHOLDER_POLYGON_MUMBAI_DAPP_TOKEN_ADDRESS' // This will be set during deployment
    },
    arbitrum_mainnet: {
        "dai_usd_price_feed_address": 'PLACEHOLDER_ARBITRUM_MAINNET_DAI_USD_PRICE_FEED',
        "eth_usd_price_feed_address": 'PLACEHOLDER_ARBITRUM_MAINNET_ETH_USD_PRICE_FEED',
        "link_usd_price_feed_address": 'PLACEHOLDER_ARBITRUM_MAINNET_LINK_USD_PRICE_FEED',
        "fau_usd_price_feed_address": 'PLACEHOLDER_ARBITRUM_MAINNET_FAU_USD_PRICE_FEED',
        "dai_token_address": 'PLACEHOLDER_ARBITRUM_MAINNET_DAI_TOKEN',
        "weth_token_address": 'PLACEHOLDER_ARBITRUM_MAINNET_WETH_TOKEN',
        "link_token_address": 'PLACEHOLDER_ARBITRUM_MAINNET_LINK_TOKEN',
        "fau_token_address": 'PLACEHOLDER_ARBITRUM_MAINNET_FAU_TOKEN',
        "dapp_token_address": 'PLACEHOLDER_ARBITRUM_MAINNET_DAPP_TOKEN_ADDRESS' // This will be set during deployment
    },
    arbitrum_goerli: {
        "dai_usd_price_feed_address": 'PLACEHOLDER_ARBITRUM_GOERLI_DAI_USD_PRICE_FEED',
        "eth_usd_price_feed_address": 'PLACEHOLDER_ARBITRUM_GOERLI_ETH_USD_PRICE_FEED',
        "link_usd_price_feed_address": 'PLACEHOLDER_ARBITRUM_GOERLI_LINK_USD_PRICE_FEED',
        "fau_usd_price_feed_address": 'PLACEHOLDER_ARBITRUM_GOERLI_FAU_USD_PRICE_FEED',
        "dai_token_address": 'PLACEHOLDER_ARBITRUM_GOERLI_DAI_TOKEN',
        "weth_token_address": 'PLACEHOLDER_ARBITRUM_GOERLI_WETH_TOKEN',
        "link_token_address": 'PLACEHOLDER_ARBITRUM_GOERLI_LINK_TOKEN',
        "fau_token_address": 'PLACEHOLDER_ARBITRUM_GOERLI_FAU_TOKEN',
        "dapp_token_address": 'PLACEHOLDER_ARBITRUM_GOERLI_DAPP_TOKEN_ADDRESS' // This will be set during deployment
    }
};

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
    "weth_token_address": MockDAIToken,
    "link_token_address": MockDAIToken,
    "fau_token_address": MockDAIToken,
    "dapp_token_address": MockDAIToken
}

const deploy_mocks = async(deployer) =>{
  await deployer.deploy(MockDAIToken)
  await deployer.deploy(MockV3Aggregator, 8, 2 * 10**8)
  tokenDai = await MockDAIToken.deployed()
  mockV3 = await MockV3Aggregator.deployed()
  deployed = true;
  return [tokenDai.address,mockV3._address]
}


const get_contract = async(contract_name, current_network, current_deployer)=>{
    //If we are on a local network, deploy a mock contract and return the contract
    //If we are on a real network, Obtain a contract from abi and name of that mock contract.
    let contract_addr;
    let contract_type = contract_to_mock[contract_name];

    if (current_network === "development") {
        if (deployed) {
            contract_addr = contract_type["contractName"] === "MockDAIToken" ? tokenDai.address : mockV3.address;
        } else {
            var token = await deploy_mocks(current_deployer);
            contract_addr = contract_type["contractName"] === "MockDAIToken" ? token[0] : token[1];
        }
    } else {
        const addresses_for_network = network_configs[current_network];
        if (addresses_for_network && addresses_for_network[contract_name]) {
            // For real networks, we typically interact with already deployed contracts.
            // The web3.eth.Contract instance is usually needed for interactions,
            // but this function's legacy is to return just the address.
            // If interaction is needed, the caller would instantiate the contract with ABI and address.
            contract_addr = addresses_for_network[contract_name];
            if (contract_addr.startsWith("PLACEHOLDER_")) {
                console.warn(`Warning: Using placeholder address for ${contract_name} on ${current_network}. Please update this address in helpful_scripts.js.`);
            }
        } else {
            console.warn(`Warning: Address for ${contract_name} not found on ${current_network}.`);
            contract_addr = null; // Or handle error appropriately
        }
    }
    return contract_addr;
}

module.exports = { get_contract, deploy_mocks, contract_to_mock, toWei, network_configs };
