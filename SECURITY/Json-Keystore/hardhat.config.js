require("@nomicfoundation/hardhat-toolbox");
require("hardhat-secure-accounts");
require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "goerli",
  networks: {
    localhost: {},
    forkingMainnet: {
      url: 'http://127.0.0.1:8545',
      forking: {
        url: process.env.ETHEREUM_MAINNET_RPC,
        blockNumber: 15058412
      }
    },
    polygon_mumbai: {
      url: process.env.ALCHEMY_MUMBAI_RPC,
      accounts: [process.env.PRIVATE_KEY]
    },
    goerli: {
      url: process.env.ALCHEMY_GOERLI_RPC,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: process.env.POLYGON_ETHERSCAN_API_KEY
  },
};
