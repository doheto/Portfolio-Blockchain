# Json Keystore

How to secure your private key with JSON Keystore both in
Foundry and Hardhat

## Technology Stack & Dependencies

- Solidity (Writing Smart Contract)
- Javascript (Game interaction)
- [Hardhat Secure Accounts](https://github.com/edgeandnode/hardhat-secure-accounts) As a node provider
- [NodeJS](https://nodejs.org/en/) To create hardhat project and install dependencies using npm

### 1. Clone/Download the Repository

### 2. Install Dependencies:

```
npm install
npm i ethereumjs-wallet
node export-key-as-json.js privkey pwd
```

### 3. Deploy contracts

```
npx hardhat scripts/deploy.js
```

### 4. In Hardhat

```
npm install hardhat-secure-accounts
```

```
npx hardhat accounts add
```

### 5. In Foundry

```
node export-key-as-json.js PRIVATE_KEY STRONG_PASSWORD
```

```
cast wallet address --keystore keystore.json
```

```
cast send 0x6a4660a9Eb923B94BaB46a286FdbCACA8E2f16B3 "incrementCounter()(int)" --rpc-url <RPC_URL> --keystore keystore.json
```
