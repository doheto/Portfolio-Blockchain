var MySMCFactory = artifacts.require("./MySMCFactory.sol");
var account_one = "0x5e55f193729b8d9a69F57d37EE141E9B682a57Ef";

module.exports = function(deployer) {
  deploySMCF(deployer);
};

function deploySMCF(deployer) {
  deployer.deploy(MySMCFactory, {from: account_one, gas:5500000}).then(function(value) {
    console.log("address = " + value.address);
  })
}