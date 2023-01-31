const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Replay Attack Exercise 3', function () {


    let deployer, vouchersSigner, user, attacker;

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, vouchersSigner, user, attacker] = await ethers.getSigners();

        const TestSignature = await ethers.getContractFactory("TestSignature", deployer);
        this.temp = await TestSignature.deploy();
        
        console.log("Signer: ", vouchersSigner.address);
        console.log("Chain ID: ", await vouchersSigner.getChainId())
        console.log("Contract Address: ", this.temp.address)
        const domain = {
            chainId: await vouchersSigner.getChainId(), // Localhost Chain ID
            verifyingContract: this.temp.address,
        }
        const types = {
            Temp: [
                { name: 'temp', type: 'string' }
            ]
        }
        const data = {
            temp: "kaki",
        }
        const signature = await vouchersSigner._signTypedData(
            domain,
            types,
            data
        )
        await this.temp.test("kaki", signature);
        
        // ------------------------------------way 2---------------------------------------

        console.log("deployer: ", deployer.address);
        console.log("vouchersSigner: ", vouchersSigner.address);
        console.log("user: ", user.address);
        console.log("attacker: ", attacker.address);

        // Deploy the contract
        const RedHawksFactory = await ethers.getContractFactory("RedHawksVIP", deployer);
        this.redHawks = await RedHawksFactory.deploy(vouchersSigner.address);
        
        // Create 2 NFTs voucher
        this.domain = {
            chainId: await vouchersSigner.getChainId(), // Localhost Chain ID TODO: voa ne e isto kaa gore
            verifyingContract: this.redHawks.address
        }
        this.types = {
            VoucherData: [
                { name: 'amountOfTickets', type: 'uint256' },
                { name: 'password', type: 'string' },
            ],
        }
        const dataToSign = {
            amountOfTickets: "2",
            password: "RedHawsRulzzz133",
        }
        const signature = await vouchersSigner._signTypedData(
            this.domain,
            this.types,
            dataToSign,
        )
        console.log(signature);
        
        // Mint NFTs
        await this.redHawks.mint(2, "RedHawsRulzzz133", signature);
    });

    it('Exploit', async function () {
        /** CODE YOUR SOLUTION HERE */
        // console.log(ethers.Wallet.createRandom().address)
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
    });
});