var poolFactory = artifacts.require("./MySMCFactory.sol")

var factory_address = "0xd111fecd3b7c7d76fa1acf897dc3bbd6683d5390";
var firstPoolAddress;
var contractInstance;
var account_one = "0xAB320e9D564043A96f4AA2B8f15D0Ae05D284b96"; // an address

contract('VerifyUserMailAddressOwnerShip', function(accounts) {
  it("should assert true", function() {    
      contractInstance = poolFactory.at(factory_address);

      contractInstance.verifyUser('blissfeli24@gmail.com', account_one);
      
      var eventNewUserMail = contractInstance.NewUserMail({address: account_one},{fromBlock: 0, toBlock: 'latest'});

      //var events = contractInstance.allEvents({address: account_one},{fromBlock: 0, toBlock: 'latest'});

      // eventNewUserMail.watch(function(error, result){
      //   if (result)
      //       console.log("args=" + result.args.adrs + " args2=" + result.args.mail);
      //       console.log("address=" + result.address);
      //       console.log("logIndex=" + result.logIndex);
      //       console.log("event=" + result.event);
      //       console.log("blockNumber=" + result.blockNumber);
      //       console.log("transactionIndex=" + result.transactionIndex);
      //       eventNewUserMail.stopWatching();
      //   if (error)
      //           console.log("error : " + err);
      // });
  });
});


//verifyUser(bytes32 mail, address adr) 