// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "./Token.sol";

contract Exchange {
    address public feeAccount;
    uint256 public feePercent;
    uint256 public orderCount;


    //balance
    //token address           user address  tokens
    mapping(address => mapping(address => uint256)) public tokens;
    // mapping id/order
    mapping(uint256 => _Order) public orders;
    // Modeling an order
    struct _Order {
        // Attributes of an order
        uint256 id; //unique id for order
        address user; // User who made order
        address tokenGet; // Address of the token they receive
        uint256 amountGet; // Amount they receive
        address tokenGive; // Address of token they give
        uint256 amountGive; // Amount they give
        uint256 timeStamp;
    }
    // Cancelled orders
    mapping(uint256 => bool) public orderCancelled;
    // Filled Order
    mapping(uint256 => bool) public orderFilled;


    event Deposit(address token, address user, uint256 amount, uint256 balance);
    event Withdraw(
        address token,
        address user,
        uint256 amount,
        uint256 balance
    );
    event Order(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );
    event Cancel(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );
    event Trade(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        address creator,
        uint256 timestamp
    );

    constructor(
        address _feeAccount,
        uint256 _feePercent
        ) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    // ------------------------
    // DEPOSIT & WITHDRAW TOKEN

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

    // -------------------
    // MAKE & CANCEL ORDER

    // Token give (the token they want to spend) - which token and how much ?
    // Token Get (the token they want to receive) - which token and how much ?
    function makeOrder(
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive
    ) public {
        // Prevent orders if tokens aren't on exchange
        require(balanceOf(_tokenGive, msg.sender) >= _amountGive, "Not enough balance on exchange");

        // Instantiate a new order
        orderCount ++;
        orders[orderCount] = _Order (
            orderCount, //id
            msg.sender, //user
            _tokenGet, // tokenGet
            _amountGet, // amountGet
            _tokenGive,
            _amountGive,
            block.timestamp //timestamp in seconds from epoch 1970
        );

        // Emit event
        emit Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );
    }

    function cancelOrder(uint256 _id) public {
        // Fetch order
        _Order storage _order = orders[_id];

        // Ensure the caller of the function is the owner of the order
        require(address(_order.user) == msg.sender, "caller of the function is not the owner of the order");

        // Order must exist
        require(_order.id == _id, "Order doesn't exist");

        // Cancel the order
        orderCancelled[_id] = true;

        // Emit event
        emit Cancel(
            _order.id,
            msg.sender,
            _order.tokenGet,
            _order.amountGet,
            _order.tokenGive,
            _order.amountGive,
            block.timestamp
        );

    }

    // ------------------------
    // EXECUTING ORDERS

    function fillOrder(uint256 _id) public {
        // 1. Must be valid orderId
        require(_id > 0 && _id <= orderCount, "Order does not exist");
        // 2. Order can't be filled
        require(!orderFilled[_id], "Order was already filled");
        // 3. Order can't be cancelled
        require(!orderCancelled[_id], "Order already cancelled");

        // Fetch order
        _Order storage _order = orders[_id];

        // Execute the trade
        _trade(
            _order.id,
            _order.user,
            _order.tokenGet,
            _order.amountGet,
            _order.tokenGive,
            _order.amountGive
        );

        // Mark order as filled
        orderFilled[_order.id] = true;
    }

    function _trade(
        uint256 _orderId,
        address _user,
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive
    ) internal {
        // Fee is paid by the user who filled the order (msg.sender)
        // Fee is deducted from _amountGet
        uint256 _feeAmount = (_amountGet * feePercent) / 100;

        // Execute the trade
        // msg.sender is the user who filled the order, while _user is who created the order
        tokens[_tokenGet][msg.sender] = tokens[_tokenGet][msg.sender] -
            (_amountGet + _feeAmount);

        tokens[_tokenGet][_user] = tokens[_tokenGet][_user] + _amountGet;

        // Charge fees
        tokens[_tokenGet][feeAccount] = tokens[_tokenGet][feeAccount] +
            _feeAmount;

        tokens[_tokenGive][_user] = tokens[_tokenGive][_user] - _amountGive;
        tokens[_tokenGive][msg.sender] = tokens[_tokenGive][msg.sender] +
            _amountGive;

        // Emit trade event
        emit Trade(
            _orderId,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            _user,
            block.timestamp
        );
    }
}
