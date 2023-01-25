require("@nomicfoundation/hardhat-toolbox"); //a bundle of all the plugins and packages that we use in hardhat : chai for testing, ethers
require("dotenv").config();

module.exports = {
  solidity: "0.8.9",
  networks: {
    goerli: {
      url: process.env.GOERLI_RPC,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  //this allows you to move the folder created by npx hardhat inside src/backend
  paths: {
    artifacts: "./src/backend/artifacts",
    sources: "./src/backend/contracts",
    cache: "./src/backend/cache",
    tests: "./src/backend/test"
  }
};
