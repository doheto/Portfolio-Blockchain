const hre = require("hardhat");

async function main() {
  console.log(`Token deployment...\n`);

  // Fetch contract to deploy
  const Token = await ethers.getContractFactory("Token");

  // Fetch accounts
  const accounts = await ethers.getSigners();

  console.log(
    `Accounts fetched:\n${accounts[0].address}\n${accounts[1].address}\n`
  );

  // Deploy contracts
  const jaagen_ex_token = await Token.deploy(
    "Jaagen Exchange Token",
    "JEX",
    "1000000"
  );
  await jaagen_ex_token.deployed();
  console.log(
    `Jaagen Exchange Token JEX Deployed to: ${jaagen_ex_token.address}`
  );

  const jaagen_token = await Token.deploy("Jaagen Token", "JAAG", "1000000");
  await jaagen_token.deployed();
  console.log(`jaagen_token Deployed to: ${jaagen_token.address}`);
}

// We use this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
