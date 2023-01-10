// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

//any call in the constructor or part of a global variable is not part of the deployed
//contract bytecode it executes only once when the contract instance is deployed
//as a consequence the code within the logic contract constructor will never be executed in the context of the proxy contrcat,
//this is why instead of using a constructor in the logic contract we need to have an initialiser function that will be called
//whenever the proxy contract links to this logic contract this is why we need this initializable.sol;
//this one will provide us with an initialize modifier that we will just attach to our initializable constructor function
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
//it provides all the mechanism we need to develop upgradable contract using this universable pattern
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
//the same thing as normal ownable contract but specifically made for upgradable contract they are different from regular contract
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract NumberV1 is Initializable, UUPSUpgradeable, OwnableUpgradeable {
   // store a number
   uint256 public number;
   
   //initializer modifier comes fromm Initializable contract
   function initialize(uint256 _initialNumber) public initializer {
       //from OwnableUpgradeable
       __Ownable_init();
       number = _initialNumber;
   }

   // it checks if the person has the authjority to do so.it is required.
   function _authorizeUpgrade(address) internal override onlyOwner {}

   // this sis a firct implementation of increment number
   // in V2 you will see that we will provide a different implementation
   function incrementNumber() external {
       number += 1;
   }
}