# Hardhat Template Project
Precofigured Hardhat Project that will boost your productivity and improve your workflow

## Technology Stack & Dependencies

- Solidity (Writing Smart Contract)
- Javascript (Game interaction)
- [Infura](https://www.alchemy.com/) As a node provider
https://infura.io/
- [NodeJS](https://nodejs.org/en/) To create hardhat project and install dependencis using npm


### 1. Clone/Download the Repository

### 2. Install Dependencies:
```
npm install
```

### 3. Compile Smart Contracts
```
npx hardhat compile
```

### 4. Test and Debug(console.log) Smart Contracts - run specific test
```
npx hardhat test test/testNumber.js
```

### 5. Deploy to hardhat network (local development blockchain)
```
npx hardhat node
```
```
npx hardhat run scripts/deploy.js
```

### 6. Deploy to Rinkeby public testnet
```
npx hardhat run --network rinkeby scripts/deploy.js
```

### 7. Interact with deployed contract on Hardhat network
```
npx hardhat console

const MyContract = await ethers.getContractFactory("Number");
const contract = await MyContract.attach("addressOfContract");
(await contract.number()).toString();
```

### 8. Impersonate account on Forked ethereum mainnet
```
npx hardhat node --fork https://mainnet.infura.io/v3/<YourInfuraProjectId>
```
```
npx hardhat test test/unlockAccount.js 
```

### 8. Verify contract on Etherscan 
```
npx hardhat run --network rinkeby scripts/deploy.js
```
```
npx hardhat verify --network rinkeby contractAddress constructorArgumentValueIfAny
```