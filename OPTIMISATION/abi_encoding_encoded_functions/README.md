# Multicall w/ ABI Encoded Functions

## Technology Stack & Tools

- Solidity (Writing Smart Contract)
- Javascript (React & Testing)
- [Ethers.js](https://docs.ethers.io/v5/) (Blockchain Interaction)
- [Hardhat](https://hardhat.org/getting-started/) (Development Framework)

## Requirements For Initial Setup
- Install [NodeJS](https://nodejs.org/en/), recommended version is v16.13.2

## Setting Up
### 1. Clone/Download the Repository

### 2. Enter Directory & Install Dependencies:
```
$ cd encoded_functions
$ npm install
```

### 3. Create .env file
You'll want to create a .env file with the following values (see .env.example):

- **ALCHEMY_API_KEY=""**

### 4. Test contract
`$ npx hardhat test`