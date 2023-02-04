// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

pragma solidity >=0.7.0 <0.9.0;

contract Auction {
    event Start();
    event Bid(address indexed sender, uint256 amount);
    event Refund(address indexed bidder, uint256 amount);
    event End(address winner, uint256 amount);

    IERC721 public collection;
    uint256 public nftId;

    address payable public seller;
    uint256 public endAt;
    bool public started;
    bool public ended;

    address public highestBidder;
    uint256 public highestBid;
    mapping(address => uint256) public bids;

    constructor(
        address _collection,
        uint256 _nftId,
        uint256 _startingBid
    ) {
        collection = IERC721(_collection);
        nftId = _nftId;

        seller = payable(msg.sender);
        highestBid = _startingBid;
    }

    function start(uint256 _endIn) external {
        require(!started, "started");
        require(msg.sender == seller, "not seller");

        collection.transferFrom(msg.sender, address(this), nftId);
        started = true;
        endAt = block.timestamp + _endIn;

        emit Start();
    }

    function bid() external payable {
        require(started, "not started");
        require(block.timestamp < endAt, "ended");
        require(msg.value > highestBid, "value < highest");

        // Take the previous bid and return to previous bidder
        if (highestBidder != address(0)) {
            payable(highestBidder).transfer(highestBid);
            emit Refund(highestBidder, highestBid);
        }

        highestBidder = msg.sender;
        highestBid = msg.value;

        emit Bid(msg.sender, msg.value);
    }

    function end() external {
        require(started, "not started");
        require(block.timestamp >= endAt, "not ended");
        require(!ended, "ended");

        ended = true;

        if (highestBidder != address(0)) {
            collection.approve(highestBidder, nftId);
            collection.transferFrom(address(this), highestBidder, nftId);
            seller.transfer(highestBid);
        } else {
            collection.approve(seller, nftId);
            collection.transferFrom(address(this), seller, nftId);
        }

        emit End(highestBidder, highestBid);
    }
}
