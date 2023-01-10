const { ethers, upgrades } = require("hardhat");

const initialNumber = 1;
async function main() {
  const NumberV1 = await ethers.getContractFactory("NumberV1");

  console.log("Deploying Number...");

  // this will deploy both the proxy and this NumberV1 logic contract and we pass the number to the constructor
  const numberV1 = await upgrades.deployProxy(NumberV1, [initialNumber], {
    //we specify here the constructor for this logic contract is initializer
    initializer: "initialize"
  });
  await numberV1.deployed();

  console.log("numberV1 deployed to:", numberV1.address);
}

main();
