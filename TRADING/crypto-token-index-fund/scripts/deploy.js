const hre = require("hardhat");

async function main() {
  // unlock account
  const user1Address = "0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8";
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [user1Address]
  });
  const user1 = await ethers.getSigner(user1Address);

  const IndexFund = await hre.ethers.getContractFactory("IndexFund");
  const indexFund = await IndexFund.deploy();
  await indexFund.deployed();

  console.log("contract deployed to:", indexFund.address);

  // Send ether to contract
  await user1.sendTransaction({
    to: indexFund.address,
    value: ethers.utils.parseEther("300")
  });

  // Check balance and if transaction was successful
  const contractBalance = await indexFund.getBalance();
  console.log(
    "balance of contract in ether (sent from unlocked acc) = ",
    contractBalance.toString() / 1e18
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
