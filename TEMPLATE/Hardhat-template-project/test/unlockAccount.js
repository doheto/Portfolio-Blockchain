const hre = require("hardhat");

require('chai')
    .use(require('chai-as-promised'))
    .should()

describe("Number contract", function () {

  let numberContract

  beforeEach(async () => {
    const Number = await ethers.getContractFactory("Number");
    numberContract = await Number.deploy();
  })

  it("should return 1000 ether balance of contract", async function () {
    // unlock/impersonate account and send 1000 ether
    const user1Address = "0x73BCEb1Cd57C711feaC4224D062b0F6ff338501e"
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [user1Address],
    });
    const user1 = await ethers.getSigner(user1Address)
    await user1.sendTransaction({
      to: numberContract.address,
      value: ethers.utils.parseEther("1000") 
    })

    const provider = ethers.getDefaultProvider();
    balance = await provider.getBalance(user1Address);
    console.log("balance of impersonated address in ether = ", balance.toString() / 1e18);

    const contractBalance = await numberContract.getBalance()
    console.log("balance of contract in ether = ", contractBalance.toString() / 1e18)
    contractBalance.toString().should.not.equal(0)
  });

});