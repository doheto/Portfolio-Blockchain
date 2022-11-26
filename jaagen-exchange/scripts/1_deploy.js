const hre = require("hardhat");

async function main() {
  // getting contract to deploy
  const Token = await hre.ethers.getContractFactory("Token"); // will fetch in the artifacts/contracts
  //deploy contract
  const token = await Token.deploy();
  await token.deployed();
  // printing
  console.log(`Token deployed to ${token.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
