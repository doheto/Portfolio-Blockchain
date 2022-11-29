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

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 value
    );

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply
        ) {
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * (10**decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
        {
        // require sender has enough balance to send amount
        require(balanceOf[msg.sender] >= _value, "not enough balance");
        // avoid tokens to be burned by sending to null address
        require(_to != address(0), "Null Address provided");

        //deduct from sender
        balanceOf[msg.sender] = balanceOf[msg.sender] - _value;
        //credit receiver
        balanceOf[_to] = balanceOf[_to] + _value;
        
        // Emit event
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
}
