const { ethers, upgrades } = require("hardhat");

//after deploying the proxy contract u get this address of the proxy contract
//taht we need to point to
const PROXY = "0x2e235998A6E818276e699C5EC8b82A54EA75BbbA";

async function main() {
  const NumberV2 = await ethers.getContractFactory("NumberV2");
  console.log("Upgrading Number contract to V2...");
  //i want to update the logic contract of this proxy that i have defined here
  await upgrades.upgradeProxy(PROXY, NumberV2);
  console.log("Number Contract upgraded successfully");
}

main();
