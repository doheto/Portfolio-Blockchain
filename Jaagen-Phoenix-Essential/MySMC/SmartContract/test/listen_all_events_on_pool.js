//var pool = artifacts.require("./MySMC.sol");
var pool_address = "0x17651a3EaBb8Cd4dD63f43481BB04041b5fB49df";
var contractInstance;

contract('listeninpool', function (accounts) {
    it("should assert true", function () {
        // contractInstance = pool.at(pool_address);

        // //var eventNewUserMail = contractInstance.NewUserMail({address: account_one},{fromBlock: 0, toBlock: 'latest'});
        // // var events = contractInstance.allEvents({address: account_one},{fromBlock: 0, toBlock: 'latest'});
        // var events = contractInstance.allEvents();

        // events.watch(function (error, result) {
        //     if (result)
        //         console.dir(result);
        //     if (error)
        //         console.log("error : " + err);
        // });


        var abi = [{"constant":true,"inputs":[],"name":"get1","outputs":[{"name":"managers","type":"address[4]"},{"name":"TotalPoolValuep","type":"uint256"},{"name":"TotalCurrentValuep","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"TotalCurrentValue","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"userAddress","type":"address"}],"name":"isWhitelisted","outputs":[{"name":"isIndeed","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"TotalPoolValueIn","type":"uint256"},{"name":"MinAmountPerContributorIn","type":"uint256"},{"name":"MaxAmountPerContributorIn","type":"uint256"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address[]"}],"name":"WhitelistManager","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"feesp","type":"uint256[4]"},{"name":"MinAmountPerContributorp","type":"uint256"},{"name":"MaxAmountPerContributorp","type":"uint256"},{"name":"ContributorArrayp","type":"address[]"},{"name":"DestinationAddressp","type":"address"},{"name":"DataFieldp","type":"bytes"},{"name":"statep","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"stateIn","type":"uint8"}],"name":"stater","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"payTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"TotalPoolValue","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"Contributors","outputs":[{"name":"value","type":"uint256"},{"name":"isWhitelisted","type":"bool"},{"name":"arrayIndex","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"managers","type":"address[4]"},{"name":"totalPoolValue","type":"uint256"},{"name":"allfees","type":"uint256[4]"},{"name":"minAmountPerContributor","type":"uint256"},{"name":"maxAmountPerContributor","type":"uint256"},{"name":"destinationAddress","type":"address"},{"name":"dataField","type":"bytes"},{"name":"isWhitelist","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"poolConcerned","type":"address"},{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"datafield","type":"bytes"},{"indexed":false,"name":"timeNow","type":"uint256"},{"indexed":false,"name":"mode","type":"uint8"},{"indexed":false,"name":"TotalCurrentPoolValue","type":"uint256"}],"name":"NewDeposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"poolConcerned","type":"address"},{"indexed":false,"name":"withdrawer","type":"address"},{"indexed":false,"name":"amountWihdrawn","type":"uint256"},{"indexed":false,"name":"TotalCurrentPoolValue","type":"uint256"}],"name":"LogNewWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"poolConcerned","type":"address"},{"indexed":true,"name":"userAddress","type":"address[]"}],"name":"LogNewWhitelist","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"adr","type":"address"}],"name":"LogEmptyPreviousWhitelistAndCurentValue","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"poolConcerned","type":"address"},{"indexed":true,"name":"userAddress","type":"address"}],"name":"LogDeleteWhitelistedAddress","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"poolConcerned","type":"address"},{"indexed":false,"name":"TotalPoolValueIn","type":"uint256"},{"indexed":false,"name":"MinAmountPerContributorIn","type":"uint256"},{"indexed":false,"name":"MaxAmountPerContributorIn","type":"uint256"}],"name":"setValueInPool","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"state","type":"uint8"}],"name":"stateChanged","type":"event"}];
        var Pool = web3.eth.contract(abi);
        var pool = Pool.at(pool_address);

        var event = pool.allEvents({ fromBlock: 0, toBlock: 'latest' });


        console.log("h");
        event.watch(function (error, result) {
            console.log(result);
        });
        console.log("g");

    });
});
