const hre = require("hardhat");

async function main() {

  // We get the contract to deploy
  const Number = await hre.ethers.getContractFactory("Number");
  const number = await Number.deploy();

  await number.deployed();

  console.log("Number deployed to:", number.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
