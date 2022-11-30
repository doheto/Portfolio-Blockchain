const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = n => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Exchange", () => {
  let exchange, deployer, feeAccount;
  const feePercent = 10;

  beforeEach(async () => {
    const Token = await ethers.getContractFactory("Token");
    token1 = await Token.deploy("Strelle", "STE", "1000000");
    token2 = await Token.deploy("Strella", "STA", "1000000");

    const accounts = await ethers.getSigners();
    deployer = accounts[0];
    feeAccount = accounts[1];
    user1 = accounts[2];

    let transaction = await token1
      .connect(deployer)
      .transfer(user1.address, tokens(100));

    const Exchange = await ethers.getContractFactory("Exchange");
    exchange = await Exchange.deploy(feeAccount.address, feePercent);
  });

  describe("Deployment", () => {
    it("Tracks the fee account", async () => {
      expect(await exchange.feeAccount()).to.equal(feeAccount.address);
    });
    it("Tracks the fee percent", async () => {
      expect(await exchange.feePercent()).to.equal(feePercent);
    });
  });

  describe("Depositing Tokens", () => {
    let transaction, result, transaction2, result2;
    let amount = tokens(10);

    describe("Success", () => {
      //the setup before each test is simple: approve tokens, then deposit tokens
      beforeEach(async () => {
        // Approve token
        transaction2 = await token1
          .connect(user1)
          .approve(exchange.address, amount);
        result2 = await transaction2.wait();

        // Deposit Token
        transaction = await exchange
          .connect(user1)
          .depositToken(token1.address, amount);
        result = await transaction.wait();
      });

      it("Tracks token deposit", async () => {
        expect(await token1.balanceOf(exchange.address)).to.equal(amount);
        expect(await exchange.tokens(token1.address, user1.address)).to.equal(
          amount
        );
        expect(
          await exchange.balanceOf(token1.address, user1.address)
        ).to.equal(amount);
      });
      it("Emits a deposit event", async () => {
        const event = result.events[1];
        expect(event.event).to.equal("Deposit");

        const args = event.args;
        expect(args.token).to.equal(token1.address);
        expect(args.user).to.equal(user1.address);
        expect(args.amount).to.equal(amount);
        expect(args.balance).to.equal(amount);
      });
    });

    describe("Failure", () => {
      //   beforeEach(async () => {});
      it("Fails when no tokens are approved", async () => {
        // Don't approve any tokens before depositing
        await expect(
          exchange.connect(user1).depositToken(token1.address, amount)
        ).to.be.reverted;
      });
      //   it("Emits a transfer event", async () => {});
    });
  });

  describe("Withdrawing Tokens", () => {
    let transaction, result;
    let amount = tokens(10);

    describe("Success", () => {
      beforeEach(async () => {
        // Deposit tokens before withdrawing

        // Approve Token
        transaction = await token1
          .connect(user1)
          .approve(exchange.address, amount);
        result = await transaction.wait();
        // Deposit token
        transaction = await exchange
          .connect(user1)
          .depositToken(token1.address, amount);
        result = await transaction.wait();

        // Now withdraw Tokens
        transaction = await exchange
          .connect(user1)
          .withdrawToken(token1.address, amount);
        result = await transaction.wait();
      });

      it("withdraws token funds", async () => {
        expect(await token1.balanceOf(exchange.address)).to.equal(0);
        expect(await exchange.tokens(token1.address, user1.address)).to.equal(
          0
        );
        expect(
          await exchange.balanceOf(token1.address, user1.address)
        ).to.equal(0);
      });

      it("emits a Withdraw event", async () => {
        const event = result.events[1]; // 2 events are emitted
        expect(event.event).to.equal("Withdraw");

        const args = event.args;
        expect(args.token).to.equal(token1.address);
        expect(args.user).to.equal(user1.address);
        expect(args.amount).to.equal(amount);
        expect(args.balance).to.equal(0);
      });
    });

    describe("Failure", () => {
      it("fails for insufficient balances", async () => {
        // Attempt to withdraw tokens without depositing
        await expect(
          exchange.connect(user1).withdrawToken(token1.address, amount)
        ).to.be.reverted;
      });
    });
  });

  describe("Checking Balances", () => {
    let transaction, result;
    let amount = tokens(1);

    beforeEach(async () => {
      // Approve Token
      transaction = await token1
        .connect(user1)
        .approve(exchange.address, amount);
      result = await transaction.wait();
      // Deposit token
      transaction = await exchange
        .connect(user1)
        .depositToken(token1.address, amount);
      result = await transaction.wait();
    });

    it("returns user balance", async () => {
      expect(await exchange.balanceOf(token1.address, user1.address)).to.equal(
        amount
      );
    });
  });
});
