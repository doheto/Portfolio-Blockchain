# Dex Aggregator

Swap coins at a cheaper exchange

## Technology Stack & Dependencies

- Solidity (Writing Smart Contract)
- Javascript (Game interaction)
- [Alchemy](https://www.alchemy.com/) As a node provider
- [NodeJS](https://nodejs.org/en/) To create hardhat project and install dependencis using npm

### 1. Clone/Download the Repository

### 2. Install Dependencies:

```
npm install
```

### 3. Fork Mainnet:

npx hardhat node --fork https://mainnet.infura.io/v3/a2eb608e33044b548c65b4d555e90ee3

### 4. Run Test

```
npx hardhat test
```

### 5. Deploy Contract to blockchain

```
npx hardhat run scripts/deploy.js
```

DexAggregator deployed to: 0xF6a8aD553b265405526030c2102fda2bDcdDC177

### 6. Interact with deployed contract on Hardhat network

```
npx hardhat console

const MyContract = await ethers.getContractFactory("DexAggregator");

const contract = await MyContract.attach("addressOfContract");
const contract = await MyContract.attach("0xF6a8aD553b265405526030c2102fda2bDcdDC177");

> await contract.sushiRate(["0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"], "1000000000000000000");
BigNumber { value: "1533814061" }

> await contract.uniRate(["0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"], "1000000000000000000");
BigNumber { value: "1534635456" }

u can see the results of the 2 commands and a price difference
>
```

### 7. run the app

```
npm start
```
