const hre = require("hardhat");

require('chai')
    .use(require('chai-as-promised'))
    .should()

describe("Number contract", function () {

  let numberFundContract

  beforeEach(async () => {
    const Number = await ethers.getContractFactory("Number");
    numberFundContract = await Number.deploy();
  })

  it("should return the value of number variable", async function () {
    const number = await numberFundContract.number()
    number.should.equal(20)
  });

});