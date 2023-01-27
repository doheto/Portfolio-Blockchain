//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract IndexFund {

    constructor() {
        //calculate the price of token
        calculatePricePerToken();
    }

    //track the blances of each user.
    mapping(address => uint) public balances;

    //read balances of the users
    function balanceOf(address user) external view returns(uint) {
        return balances[user];
    }

    //return the contract balances
    //external means smartcontract can call it
    function getBalance() external view returns(uint) {
        return address(this).balance;
    }

    //receive money no implementation needed
    receive() external payable {}

    //chainlink to get the prices using this address from the chainlink docs: docs.chain.link/docs/ethereum-addresses/
    //
    AggregatorV3Interface public uniPriceAggregator = AggregatorV3Interface(0xD6aA3D25116d8dA79Ea0246c4826EB951872e02e);
    AggregatorV3Interface public compPriceAggregator = AggregatorV3Interface(0x1B39Ee86Ec5979ba5C322b826B3ECb8C79991699);
    AggregatorV3Interface public snxPriceAggregator = AggregatorV3Interface(0x79291A9d692Df95334B1a0B3B4AE6bC606782f8c);
    AggregatorV3Interface public mkrPriceAggregator = AggregatorV3Interface(0x24551a8Fb2A7211A25a17B1481f043A8a8adC7f2);
    AggregatorV3Interface public kncPriceAggregator = AggregatorV3Interface(0x656c0544eF4C98A6a98491833A89204Abb045d6b);

    int public uniPrice;
    int public compPrice;
    int public snxPrice;
    int public mkrPrice;
    int public kncPrice;

    //it will call to get the price of all this
    function getPricesOfAllCoins() public {

        (,int uniPrice1,,,) = uniPriceAggregator.latestRoundData();
        (,int compPrice1,,,) = compPriceAggregator.latestRoundData();
        (,int snxPrice1,,,) = snxPriceAggregator.latestRoundData();
        (,int mkrPrice1,,,) = mkrPriceAggregator.latestRoundData();
        (,int kncPrice1,,,) = kncPriceAggregator.latestRoundData();

        uniPrice = uniPrice1;
        compPrice = compPrice1;
        snxPrice = snxPrice1;
        mkrPrice = mkrPrice1;
        kncPrice = kncPrice1;

    }

    uint public pricePerToken;

    function calculatePricePerToken() public {
        getPricesOfAllCoins();
        //the price per each index token: the amount of token times the unitprice
        pricePerToken = uint(
            uniPrice * 500 +
            mkrPrice * 1 +
            compPrice * 10 +
            kncPrice * 300 +
            snxPrice * 100
        );
    }

    function buyToken(uint amount) public payable {
        require(msg.value >= amount * pricePerToken, "not enough funds to buy a token !");
        balances[msg.sender] += amount;
    }

    

    function defiIncreased() public {
        //hahaha this is just simulation please relax
        pricePerToken = pricePerToken *  2;
    }

    function redeemToken() public {
        uint amountOfTokens = balances[msg.sender];
        require(amountOfTokens > 0, "you don't have any account with us");
        //amount of Ether to transfer but you don't have that Ether in the smc!
        uint amountInWeiToTransfer = amountOfTokens * pricePerToken;
        balances[msg.sender] = 0;
        payable(msg.sender).transfer(amountInWeiToTransfer);
    }
}
