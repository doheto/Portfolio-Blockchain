const NFT = artifacts.require("NFT");

module.exports = async function(deployer) {
  const IPFS_IMAGE_METADATA_URI = `ipfs://12D3KooWB8uJtXK1vFaMB1X5P4KiVtMt5DgjNwXndgE5Bjpe9qEU/`;

  await deployer.deploy(
    NFT,
    "Famous Paintings",
    "PAINT",
    IPFS_IMAGE_METADATA_URI
  );
};
