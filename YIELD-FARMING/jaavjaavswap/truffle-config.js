require("babel-register");
require("babel-polyfill");
require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const privateKeys = process.env.PRIVATE_KEYS || "";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(
          privateKeys.split(","), // Array of account private keys
          `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}` // Url to an Ethereum Node
        );
      },
      gas: 5000000,
      gasPrice: 25000000000,
      network_id: 4
    },
    goerli2: {
      provider: function() {
        return new HDWalletProvider(
          privateKeys.split(","),
          `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}` // URL to Ethereum Node
        );
      },
      gasPrice: 60000000000, // 60 Gwei
      gas: 5000000,
      network_id: 5
    },
    goerli: {
      provider: function() {
        return new HDWalletProvider(
          privateKeys.split(","),
          `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}` // URL to Ethereum Node
        );
      },
      gasPrice: 60000000000, // 60 Gwei
      gas: 4000000,
      network_id: 5
    },

    matic: {
      provider: function() {
        return new HDWalletProvider(
          [process.env.DEPLOYER_PRIVATE_KEY],
          `https://polygon-rpc.com`
        );
      },
      network_id: 137
    }
  },
  plugins: ["truffle-plugin-verify"],
  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY
  },
  compilers: {
    solc: {
      version: "0.6.12"
    }
  }
};
