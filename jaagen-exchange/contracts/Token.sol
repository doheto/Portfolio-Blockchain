// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract Token {
    // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);
    string public name;
    string public symbol;
    uint256 public decimals = 18;
    uint256 public totalSupply;

    //track balances
    mapping(address => uint256) public balanceOf;

    constructor(string memory _name, string memory _symbol, uint256 _totalSupply) {
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * (10**decimals);
        balanceOf[msg.sender] = totalSupply;
    }
}
