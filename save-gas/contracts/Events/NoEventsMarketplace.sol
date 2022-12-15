// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract NoEventsMarketplace {

    uint itemCount;
    
    struct Item {
        uint itemId;
        address nftContract;
        uint tokenId;
        uint price;
        address payable seller;
        uint timestampListed;
        address buyer;
        uint timestampSold;
        bool sold;
    }
    // itemId -> Item
    mapping(uint => Item) public items;

    function makeItem(address _nftContract, uint _tokenId, uint _price) external {
        itemCount ++;
        // add new item to items mapping
        items[itemCount] = Item (
            itemCount,
            _nftContract,
            _tokenId,
            _price,
            payable(msg.sender),
            block.timestamp,
            address(0),
            0,
            false
        );
    }
    function buyItem(uint _itemId) external payable {
        Item storage item = items[_itemId];
        // update item
        item.sold = true;
        item.buyer = msg.sender;
        item.timestampSold = block.timestamp;
    }


}
