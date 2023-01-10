# Upgradable-contracts
3 Patterns to Upgradable Smart Contracts - UUPS, Diamond, Transparent

## Technology Stack & Dependencies

- Solidity (Developing Smart Contract)
- Javascript (Deloying the Smart Contract)
- [Infura](https://www.alchemy.com/) As a node provider
- [NodeJS](https://nodejs.org/en/) To create hardhat project and install dependencis using npm

### 1. Clone/Download the Repository

### 2. Install Dependencies:
```
$ cd diamond-demo
```
```
$ cd uups-demo
```
```
$ npm install
```
### 3. Deploy UUPS Smart Contracts to Kovan
```
$ npx hardhat run --network kovan ./scripts/1_deploy_number.js
```
- Input address of Proxy contract in script before upgrading
```
$ npx hardhat run --network kovan ./scripts/2_upgrade_number.js
```

### 4. Verify contract on Etherscan
```
$ npx hardhat verify --network kovan addressOfContract
```

