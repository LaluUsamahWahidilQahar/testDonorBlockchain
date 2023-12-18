const DonorDarah = artifacts.require("DonorDarah");

module.exports = function(_deployer) {
  // Use deployer to state migration tasks.
  _deployer.deploy(DonorDarah);
};
