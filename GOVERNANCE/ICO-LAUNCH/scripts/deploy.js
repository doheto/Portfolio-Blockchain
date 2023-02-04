const hre = require("hardhat");
const network = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  // We get the contract to deploy
  const JaagenToken = await hre.ethers.getContractFactory("JaagenToken");
  const jaagenToken = await JaagenToken.deploy();
  await jaagenToken.deployed();
  console.log("jaagenToken deployed to:", jaagenToken.address);

  const JaagenTokenSale = await hre.ethers.getContractFactory(
    "JaagenTokenSale"
  );
  const jaagenTokenSale = await JaagenTokenSale.deploy(
    1530,
    "0xac33e8ac9f4a2b6d9bb821e7fce1d83de78e2687",
    jaagenToken.address,
    "0xac33e8ac9f4a2b6d9bb821e7fce1d83de78e2687",
    1
  );
  await jaagenTokenSale.deployed();
  console.log("jaagenTokenSale deployed to:", jaagenTokenSale.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
