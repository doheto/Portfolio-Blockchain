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
    // allowance
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 value
    );
    
    event Approval(
        address indexed owner,
        address indexed spender,
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
        _transfer(msg.sender, _to, _value);
        return true;
    }

    function _transfer(
        address _from,
        address _to,
        uint256 _value
        ) internal {
        // avoid tokens to be burned by sending to null address
        require(_to != address(0), "Null Address provided");
        //deduct from sender
        balanceOf[_from] = balanceOf[_from] - _value;
        //credit receiver
        balanceOf[_to] = balanceOf[_to] + _value;

        // Emit event
        emit Transfer(_from, _to, _value);
    }


    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
        {
        require(_spender != address(0), "Null Address provided");
        //code goes here in
        allowance[msg.sender][_spender] = _value;
        emit Approval (msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value)
        public
        returns (bool success)
        {
        //checking approval
        require(_value <= balanceOf[_from], "Balance is not enough");
        require(_value <= allowance[_from][msg.sender], "Approval amount is not enough");
        
        //Reset allowance
        allowance[_from][msg.sender] = allowance[_from][msg.sender] - _value;
        //spend tokens
        _transfer((_from), _to, _value);
        return true;
    }
}
