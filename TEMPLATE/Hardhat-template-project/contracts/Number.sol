//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract Number {
    uint public number = 50;

    AggregatorV3Interface public uniPriceAggregator = AggregatorV3Interface(0xD6aA3D25116d8dA79Ea0246c4826EB951872e02e);
    AggregatorV3Interface public compPriceAggregator = AggregatorV3Interface(0x1B39Ee86Ec5979ba5C322b826B3ECb8C79991699);

    int public uniPrice;
    int public compPrice;

    function getPricesOfAllCoins() public {

        (,int uniPrice1,,,) = uniPriceAggregator.latestRoundData();
        (,int compPrice1,,,) = compPriceAggregator.latestRoundData();

        uniPrice = uniPrice1;
        compPrice = compPrice1;
    }

    receive() external payable {}

    function getBalance() view external returns(uint) {
        return address(this).balance;
    }
}
