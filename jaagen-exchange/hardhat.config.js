require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const privateKeys = process.env.PRIVATE_KEYS || ""; //if no private keys just return empty
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    localhost: {}, //it will understand automatically to connect to localhost
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: privateKeys.split(",")
    }
  }
};
