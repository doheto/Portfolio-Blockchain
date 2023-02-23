var SMCToken = artifacts.require("./SMCToken.sol");

module.exports = function(deployer) {
  const _account_one = "0x5e55f193729b8d9a69F57d37EE141E9B682a57Ef";
  const _name = "SMC Token";
  const _symbol = "SMT";
  const _decimal = 18
  deployer.deploy(SMCToken, _account_one, 1000000000000000000000000, _name, _symbol, _decimal, {from: _account_one, gas:2000000}).then(function(value) {
    console.log("SMC Token address = " + value.address);
  })
};