// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MarketplaceWithEvents {

    uint itemCount;
    
    struct Item {
        uint itemId;
        address nftContract;
        uint tokenId;
        uint price;
        address payable seller;
        bool sold;
    }
    // itemId -> Item
    mapping(uint => Item) public items;

    event Offered (
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller,
        uint timestamp
    );
    event Bought(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer,
        uint timestamp
    );

    function makeItem(address _nftContract, uint _tokenId, uint _price) external {
        itemCount ++;
        // add new item to items mapping
        items[itemCount] = Item (
            itemCount,
            _nftContract,
            _tokenId,
            _price,
            payable(msg.sender),
            false
        );
        // emit Offered event
        emit Offered(
            itemCount,
            address(_nftContract),
            _tokenId,
            _price,
            msg.sender,
            block.timestamp
        );
    }
    function buyItem(uint _itemId) external payable {
        Item storage item = items[_itemId];
        // update item to sold
        item.sold = true;
        // emit Bought event
        emit Bought(
            _itemId,
            address(item.nftContract),
            item.tokenId,
            item.price,
            item.seller,
            msg.sender,
            block.timestamp
        );
    }


}
