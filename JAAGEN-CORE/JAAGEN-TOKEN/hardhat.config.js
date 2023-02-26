require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");

/*
npx hardhat run --network localhost ./scripts/1_deploy.js
Token deployment...
Accounts fetched:
0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Jaagen Exchange Token JEX Deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
jaagen_token Deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
*/

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
      // accounts: [process.env.PRIVATE_KEY] //you specify this if u want only one account to be used
    },
    forkingMainnet: {
      url: "http://127.0.0.1:8545",
      forking: {
        url: process.env.FORKED_MAINNET_RPC,
        blockNumber: 15058412
      }
    },
    polygon_mumbai: {
      url: process.env.INFURA_POLYGON_MUMBAI_RPC,
      accounts: [process.env.PRIVATE_KEY]
    },
    goerli: {
      url: process.env.INFURA_GOERLI_RPC,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
