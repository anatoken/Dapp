var AnaToken = artifacts.require("./AnaToken.sol");
var Recycle = artifacts.require("./Recycle.sol");
var ServiceProvider = artifacts.require("./ServiceProvider.sol")

module.exports = function(deployer) {
  deployer.deploy(AnaToken);
  deployer.deploy(ServiceProvider);
  deployer.deploy(Recycle);
};
