// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Number {
    uint public number = 99;

    function incrementNumber() public {
        number += 1;
    }
}
