var poolFactory = artifacts.require("./MySMCFactory.sol")

var factory_address = "0x844f3e66a45f393ae5ac04172960ddc6084d7a9d";
var firstPoolAddress;
var contractInstance;
var account_one = "0x6a8e44545803c5393af369c9B80150717a1C3710"; // an address

contract('createpool', function (accounts) {
    it("should assert true", function () {
        contractInstance = poolFactory.at(factory_address);
        var managers = [account_one, '0x497A49648885f7aaC3d761817F191ee1AFAF399C', '0x1B348F43C11194Ed800bD243B081c54F156313F4'];
        var allfees = [1000, 5, 1000, 6];
        // string the, bytes32 mail, address[4] managers, uint totalPoolValue, uint minAmountPerContributor,
        //   uint maxAmountPerContributor, bool isWhiteList, address destinationAddress, 
        //   bytes dataField, uint[4] allfees
        contractInstance.create('7a1t3290-b113-11e8-8253-8d1dca46860a2429622a-b3c1-4913-b4f7-65fd37e65edc',
            '0x67696c6461733235323640676d61696c2e636f6d', managers, 1015, 1, 5, false, '0x6a8e44545803c5393af369c9B80150717a1C3710', '0x223', allfees, { from: account_one });

        //var eventNewUserMail = contractInstance.NewUserMail({address: account_one},{fromBlock: 0, toBlock: 'latest'});

        // var events = contractInstance.allEvents({address: account_one},{fromBlock: 0, toBlock: 'latest'});
        var events = contractInstance.allEvents();

        events.watch(function (error, result) {
            if (result)
                console.dir(result);
            // eventNewUserMail.stopWatching();
            if (error)
                console.log("error : " + err);
        });
    });
});


//verifyUser(bytes32 mail, address adr) 