// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract A is ReentrancyGuard{
    function sendEther(address contractB) external payable nonReentrant returns (bool) {
        //(bool sent, bytes data) = contractB.call{value: 1 wei}("");
        //alternative if u dont use the data parameter
        //the call is very important
        //it sents all the remainnig gas to the calling contract 
        //it is different from the sent and gtransfer function which where created to prevent reentrancy attack
        //transfer and sent are deprecated
        //to send ether it is recommended to use the call function in combination with reetrnacy guard to avoid reetrncay attack 
        //openzeppelin propvides it.
        (bool sent,) = contractB.call{value: 1 wei}("");
        //require(sent);//always check this when u send funds
        return sent;

    }

    bytes public returnValue;

    function callFunction(address contractB) external payable {
        (bool sent, bytes memory data) = contractB.call{value: 1 ether, gas: 30000}(//Encode the function signature
            abi.encodeWithSignature("incrementNumber(uint256)", 10));
        returnValue = data;
        require(sent);
    }
}

contract B {
    uint public number = 1;

    //external : will be called from other contracts 
    //view : cause to view on the blockchain
    function getBalance() external view returns (uint) {
        return address(this).balance;
    }

    //it is a built in function 
    //watchout there can be reentrancy attack so ...
    //payable means it receives ETHER
    receive() external payable {
        console.log("receive function was called ");
    }

    fallback() external payable {
        console.log("fallback function was called");
    }

    function incrementNumber(uint by) external payable returns (string memory) {
        number += by;
        return "some string";
    }
}
