const hre = require("hardhat");

async function main() {
  const NAME = "AI JAAGEN NFT";
  const SYMBOL = "JANFT";
  const COST = ethers.utils.parseUnits("0.1", "ether"); // 1 ETH
  const MAX_SUPPLY = 1000000;
  const IPFS_IMAGE_METADATA_URI = `ipfs://${process.env.IPFS_IMAGE_METADATA_CID}/`;
  const IPFS_HIDDEN_IMAGE_METADATA_URI = `ipfs://${process.env.IPFS_HIDDEN_IMAGE_METADATA_CID}/hidden.json`;

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(
    NAME,
    SYMBOL,
    COST,
    MAX_SUPPLY,
    IPFS_IMAGE_METADATA_URI,
    IPFS_HIDDEN_IMAGE_METADATA_URI
  );
  await nft.deployed();

  console.log(`Deployed NFT Contract at: ${nft.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
