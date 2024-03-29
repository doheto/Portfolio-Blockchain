require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");

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

const infuraProjectId = "a2eb608e33044b548c65b4d555e90ee3";

module.exports = {
  solidity: "0.8.4",
  paths: {
    artifacts: "./src/artifacts",
    sources: "./src/contracts",
    cache: "./src/cache"
  },
  networks: {
    hardhat: {
      forking: {
        url: `https://mainnet.infura.io/v3/${infuraProjectId}`
      }
    }
  }
};
