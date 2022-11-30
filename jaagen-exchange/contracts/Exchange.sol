// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "./Token.sol";

contract Exchange {
    address public feeAccount;
    uint256 public feePercent;
    //balance
    //token address           user address  tokens
    mapping(address => mapping(address => uint256)) public tokens;

    event Deposit(address token, address user, uint256 amount, uint256 balance);
    event Withdraw(
        address token,
        address user,
        uint256 amount,
        uint256 balance
    );

    constructor(
        address _feeAccount,
        uint256 _feePercent
        ) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }
    // Deposit Tokens
    function depositToken(
        address _token,
        uint256 _amount
    ) public {
        //Transfer tokens to exchange
        require(Token(_token).transferFrom(msg.sender, address(this), _amount), "TransferFrom Failed at Token->Exchange level");
        // update user balance
        tokens[_token][msg.sender] = tokens[_token][msg.sender] + _amount;
        // Emit an event
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    // Withdraw Tokens
    function withdrawToken(
        address _token,
        uint256 _amount
    ) public {
        // Ensure user has enough tokens to withdraw
        require(tokens[_token][msg.sender] >= _amount, "not enough balance to withdraw");

        // Transfer tokens to user
        Token(_token).transfer(msg.sender, _amount);

        // Update user balance
        tokens[_token][msg.sender] = tokens[_token][msg.sender] - _amount;

        // Emit event
        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    // Check balances
    function balanceOf(
        address _token,
        address _user
    ) public view returns (uint256)
    {
        return tokens[_token][_user];
    }
}
