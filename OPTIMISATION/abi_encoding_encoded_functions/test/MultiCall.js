const { expect } = require("chai");
const { ethers } = require("hardhat");
require("dotenv").config();

const UniswapV2Router02 = require("@uniswap/v2-periphery/build/IUniswapV2Router02.json");
const ERC20 = require("@openzeppelin/contracts/build/contracts/ERC20.json");

const IERC20 = new ethers.utils.Interface(JSON.stringify(ERC20.abi));
const IUniswapV2Router02 = new ethers.utils.Interface(
  JSON.stringify(UniswapV2Router02.abi)
);

const sRouter = "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F";
const uRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const CGT = "0xF5238462E7235c7B62811567E63Dd17d12C2EAA0";
const TOKE = "0x2e9d63788249371f1DFC918a52f8d799F4a38C94";

describe("MultiCall", function() {
  let multiCall;
  let uniswap, sushiswap;
  let token0, token1, token2;
  let owner;

  beforeEach(async () => {
    // we are forking here. we point to eth node and we freeze it.
    // Set current forked block number
    await network.provider.request({
      method: "hardhat_reset",
      params: [
        {
          forking: {
            jsonRpcUrl: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
            blockNumber: 14398652
          }
        }
      ]
    });

    // Fetch & deploy contracts
    const MultiCall = await ethers.getContractFactory("MultiCall");
    multiCall = await MultiCall.deploy();

    // Fetch owner account
    accounts = await ethers.getSigners();
    owner = accounts[0];

    // Establish router contracts
    uniswap = new ethers.Contract(uRouter, UniswapV2Router02.abi, owner);
    sushiswap = new ethers.Contract(sRouter, UniswapV2Router02.abi, owner);

    // Establish token contracts
    token0 = new ethers.Contract(WETH, ERC20.abi, owner);
    token1 = new ethers.Contract(CGT, ERC20.abi, owner);
    token2 = new ethers.Contract(TOKE, ERC20.abi, owner);

    // Unlock an account with WETH
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0x2fEb1512183545f48f6b9C5b4EbfCaF49CfCa6F3"]
    });

    // Transfer WETH to our address
    const signer = await ethers.getSigner(
      "0x2fEb1512183545f48f6b9C5b4EbfCaF49CfCa6F3"
    );
    const amount = ethers.utils.parseUnits("0.75", "ether");
    const transaction = await token0
      .connect(signer)
      .transfer(owner.address, amount);
    await transaction.wait();
  });

  describe("Deployments", () => {
    it("Tracks the owner", async () => {
      expect(await multiCall.owner()).to.equal(owner.address);
    });
  });

  describe("Simple Token Transfer", () => {
    const amount = ethers.utils.parseUnits("0.75", "ether");
    let transaction, result;

    beforeEach(async () => {
      // Approve tokens for transfer...
      transaction = await token0.approve(multiCall.address, amount);
      result = await transaction.wait();

      // Define the target contract address...
      const target = token0.address;

      // Define the function signature we want to call...
      const signature = "transferFrom(address, address, uint256)";

      // Define the parameters for that function...
      const parameter = [owner.address, multiCall.address, amount];

      // Encode data...
      const encodedData = IERC20.encodeFunctionData(signature, parameter);

      // Make the call to our contract...
      transaction = await multiCall
        .connect(owner)
        .executeCalls([target], [encodedData]);
      result = await transaction.wait();
    });

    it("Updates the owner balance", async () => {
      expect(await token0.balanceOf(owner.address)).to.equal(0);
    });

    it("Updates the contract balance", async () => {
      expect(await token0.balanceOf(multiCall.address)).to.equal(amount);
    });
  });

  describe("Multiswap Arbitrage", () => {
    const amount = ethers.utils.parseUnits("0.75", "ether");
    let transaction, result, contractBalanceBefore;

    beforeEach(async () => {
      // Approve tokens for transfer...
      transaction = await token0.approve(multiCall.address, amount);
      result = await transaction.wait();

      // Define the target contract addresses...
      const targets = [
        token0.address,
        token0.address,
        uRouter,
        token1.address,
        uRouter,
        token2.address,
        sRouter
      ];

      // Define the function signatures we want to call...
      const signatures = [
        "transferFrom(address, address, uint256)",
        "approve(address, uint256)",
        "swapExactTokensForTokens(uint256, uint256, address[], address, uint256)",
        "approve(address, uint256)",
        "swapExactTokensForTokens(uint256, uint256, address[], address, uint256)",
        "approve(address, uint256)",
        "swapExactTokensForTokens(uint256, uint256, address[], address, uint256)"
      ];

      const [amountIn0, amountOut0] = await uniswap.getAmountsOut(amount, [
        token0.address,
        token1.address
      ]);
      const [amountIn1, amountOut1] = await uniswap.getAmountsOut(amountOut0, [
        token1.address,
        token2.address
      ]);
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

      // Define the parameters for the functions...
      const parameters = [
        [owner.address, multiCall.address, amount], // TransferFrom
        [uRouter, amount], // Approve Uniswap
        [
          amount,
          0,
          [token0.address, token1.address],
          multiCall.address,
          deadline
        ], // swapExactTokensForTokens
        [uRouter, amountOut0], // Approve Uniswap
        [
          amountOut0,
          0,
          [token1.address, token2.address],
          multiCall.address,
          deadline
        ], // swapExactTokensForTokens
        [sRouter, amountOut1], // Approve Sushiswap
        [
          amountOut1,
          amount,
          [token2.address, token0.address],
          multiCall.address,
          deadline
        ] // swapExactTokensForTokens
      ];

      // We'll need to encode each function signature and it's correlated parameters...
      let data = [];

      for (var i = 0; i < signatures.length; i++) {
        // If our target address is equal to Uniswap or Sushiswap, use the Uniswap V2 Router interface.
        // Otherwise we know we are either transferring or approving tokens...

        if (targets[i] == uRouter || targets[i] == sRouter) {
          encodedData = IUniswapV2Router02.encodeFunctionData(
            signatures[i],
            parameters[i]
          );
        } else {
          encodedData = IERC20.encodeFunctionData(signatures[i], parameters[i]);
        }

        // Push the encodedData to the array...
        data.push(encodedData);
      }

      // Make call to our contract...
      transaction = await multiCall.connect(owner).executeCalls(targets, data);
      result = await transaction.wait();
    });

    it("Updates the owner balance", async () => {
      expect(await token0.balanceOf(owner.address)).to.equal(0);
    });

    it("Updates the contract balance", async () => {
      expect(
        Number(await token0.balanceOf(multiCall.address))
      ).to.be.greaterThan(0);
    });

    it("Allows withdraw to owner", async () => {
      transaction = await multiCall.connect(owner).withdraw(token0.address);
      await transaction.wait();

      expect(Number(await token0.balanceOf(owner.address))).to.be.greaterThan(
        0
      );
      expect(await token0.balanceOf(multiCall.address)).to.equal(0);
    });
  });
});
