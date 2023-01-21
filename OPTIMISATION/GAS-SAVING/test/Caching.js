const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Caching", function () {
  let deployer, user;
  let squaring;
  const nums = [5, 10, 15, 20, 25, 30]
  beforeEach(async function () {
    [deployer, user] = await ethers.getSigners();

    const SquaringFactory = await ethers.getContractFactory('Squaring', deployer);
    squaring = await SquaringFactory.deploy(nums);
  });
  it('Should cost less gas to execute cached versus uncached item inspections', async function () {
    let receipt
    await Promise.all(nums.map(async (i, indx) => {
      receipt = await (await squaring.sqrNumUncached(indx)).wait()
      const gasUsedUncached = receipt.gasUsed
      receipt = await (await squaring.sqrNumCached(indx)).wait()
      const gasUsedCached = receipt.gasUsed
      expect(gasUsedUncached).to.be.gt(gasUsedCached)
      expect(await squaring.sqrs(indx)).to.eq(i*i)
      const percDiff = Math.round(((gasUsedUncached/gasUsedCached) - 1)*100)
      console.log(`Gas used to square ${i}:`, `Uncached ${gasUsedUncached}, `, `Cached ${gasUsedCached} (${percDiff}% more gas efficient)`)
    }))
  });

});
