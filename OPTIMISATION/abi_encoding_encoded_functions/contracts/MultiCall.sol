// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MultiCall {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    //array of instruction like: buy on A then...
    //memory _targets [UNISWAP, SUSHISWAP]
    //_data is [BUY , SELL]
    function executeCalls(address[] memory _targets, bytes[] calldata _data)
        public
    {
        require(
            _targets.length == _data.length,
            "_targets length != _data length"
        );

        for (uint256 i; i < _targets.length; i++) {
            (bool success, bytes memory result) = _targets[i].call(_data[i]);
            require(success, "call failed");
        }
    }

    function withdraw(address token) public {
        ERC20(token).transfer(owner, ERC20(token).balanceOf(address(this)));
    }
}
