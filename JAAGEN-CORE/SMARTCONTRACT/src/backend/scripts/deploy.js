const hre = require("hardhat");

async function main() {
  const IERC20_SOURCE = "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20";

  const [addr0, addr1, addr2, addr3, addr4] = await ethers.getSigners();

  console.log(`Accounts fetched:\n${addr0.address}\n${addr1.address}\n`);

  //============== START DEPLOYMENT ========================//

  //DEPLOY Factory contract
  const Factory = await hre.ethers.getContractFactory("MySMCFactory");
  let factory = await Factory.deploy();

  await factory.deployed();
  console.log("Factory deployed to:", factory.address);

  //================= END DEPLOYMENTS =====================//

  // For each contract, pass the deployed contract and name to this function to save a copy of the contract ABI and address to the front end.
  saveFrontendFiles(factory, "MySMCFactory");
}

function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../../frontend/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
