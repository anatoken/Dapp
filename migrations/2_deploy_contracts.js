var AnaToken = artifacts.require("./AnaToken.sol");
var Recycle = artifacts.require("./Recycle.sol");
var ServiceProvider = artifacts.require("./ServiceProvider.sol")
var RBACExtend = artifacts.require("./RBACExtend.sol")

module.exports = function(deployer) {
  deployer.deploy(RBACExtend).then(() => {
    deployer.deploy(Recycle, RBACExtend.address);
  });
  deployer.deploy(AnaToken);
  deployer.deploy(ServiceProvider);
};
