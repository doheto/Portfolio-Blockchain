var poolFactory = artifacts.require("./MySMCFactory.sol")

var factory_address;
var firstPoolAddress;
var contractInstance;
var account_one = "0xAB320e9D564043A96f4AA2B8f15D0Ae05D284b96"; // an address

contract('MySMCFactory', function(accounts) {
  it("should assert true", function() {
    poolFactory.new({from: account_one}).then(function(instance){
      factory_address = instance.address;
      console.log("factory_address " + factory_address);       
      contractInstance = poolFactory.at(factory_address);
      return contractInstance.getFeePerAutoDistribution.call();
    }).then(function(value){
      //TODO test array size after create
      
      //checking that fee per autodistribution has been set
      assert.equal(value, 2);

      var act = contractInstance.create(
        account_one, "", "", 
        "", 1000, 
        1, 2, 3, 4,
        50, true, "", "", {from: account_one}
      );

      var eventPoolCreation = contractInstance.ContractCreated({address: account_one},{fromBlock: 0, toBlock: 'latest'});
      eventPoolCreation.watch(function(error, result){
        if (!error)
            firstPoolAddress = result.address;
            console.log(firstPoolAddress);
            eventPoolCreation.stopWatching();
      });

    }).catch(function(err) {
      console.log("error " + err);
    });
  });
});



  // test that initially there is no pool inside the contract

  // test pool creation 
  // it("should create pool contract", function() {
  //   var my_s_m_c_factory;
  //   poolFactory.deployed().then(function(instance){
  //     my_s_m_c_factory = instance;
  //     return my_s_m_c_factory.create(
  //       "0x6a8e44545803c5393af369c9B80150717a1C3710", "", "", 
  //       "", 1000, 
  //       1, 2, 3, 4,
  //       50, true, "", ""
  //     );
  //   }).then(function(value) {
  //     console.log("Creation successful!");
  //     console.log("tx "+ value.tx);
  //     console.log("receipt "+ value.receipt);
  //     console.log("address "+ value.address);
  //     var t = web3.eth.getTransactionReceipt(value.tx);
  //     console.log(t);
  //     return my_s_m_c_factory.getChildrenCount.call();
  //   }).then(function(result) {
  //     // check pool size is 1 
  //     assert.equal(result.valueOf(), 1); 
  //     console.log("the contract has been created YESS")     
  //   }).catch(function(e) {
  //     console.log("Error during pool contract creation ! " + e);
  //   }) 
  // });
//});


