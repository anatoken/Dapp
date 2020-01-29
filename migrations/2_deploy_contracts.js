var AnaToken = artifacts.require("./AnaToken.sol");

module.exports = function(deployer) {
  deployer.deploy(AnaToken);
};
