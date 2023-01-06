#!/usr/bin/env bash

# Deploy contracts
truffle migrate --reset --network goerli

# Verify Contracts on Etherscan
truffle run verify SushiToken --network goerli --license SPDX-License-Identifier
truffle run verify MasterChef --network goerli --license SPDX-License-Identifier

# Flatten Contracts
./node_modules/.bin/truffle-flattener contracts/SushiToken.sol > flats/SushiToken_flat.sol
./node_modules/.bin/truffle-flattener contracts/MasterChef.sol > flats/MasterChef_flat.sol
