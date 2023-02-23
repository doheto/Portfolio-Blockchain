pragma solidity ^0.4.24;
//import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "./ERC20.sol";
//import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "./ERC20Detailed.sol";
/**
 * SMCToken for test for SMC Project
 * Based on OpenZeppelin for modularity and security purposes
 **/
contract  SMCToken is ERC20, ERC20Detailed {

    constructor(address _account, uint256 _amount, string _name, string _symbol, uint8 _decimals) 
        ERC20Detailed(_name, _symbol, _decimals) 
        public {
            _mint(_account, _amount);
    }

}