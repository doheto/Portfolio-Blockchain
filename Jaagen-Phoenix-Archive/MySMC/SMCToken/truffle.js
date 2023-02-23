require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider');

/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // match any network id 
      from: "0xAB320e9D564043A96f4AA2B8f15D0Ae05D284b96",
      gas: 2580000,     //
      gasPrice: 100000000000  // 100gwei
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`
        )
      },
      gas: 5000000,
      gasPrice: 100000000000,
      network_id: 4,
      from: "0x5e55f193729b8d9a69F57d37EE141E9B682a57Ef"
    },
    kovan: {
      provider: function() {
        
        return new HDWalletProvider(
          process.env.MNEMONIC,
          `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`
        )
      },
      gas: 5000000,
      gasPrice: 25000000000,
      network_id: 42
    },
    live: {
      host: "178.25.19.88", // Random IP for example purposes (do not use)
      port: 80,
      network_id: 1,        // Ethereum public network
      // optional config values:
      // gas
      // gasPrice
      // from - default address to use for any transaction Truffle makes during migrations
      // provider - web3 provider instance Truffle should use to talk to the Ethereum network.
      //          - function that returns a web3 provider instance (see below.)
      //          - if specified, host and port are ignored.
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};

// gasUsed is the total gas that is consumed by the transaction
// gasPrice price (in ether) of one unit of gas specified in the transaction
// Total cost = gasUsed * gasPrice
// 3 * 0.05e12 = 1.5e11 wei
// Since 1 ether is 1e18 wei, the total cost would be 0.00000015 Ether.
