const { ethers } = require("hardhat");

async function main() {
  const TOKEN_ADDRESS = "0xf07ce10cE718fEe22dFEe06B4048B734bC95b954";
  const [signer] = await ethers.getSigners();

  const token = await ethers.getContractAt("WATTToken", TOKEN_ADDRESS);

  const MINTER_ROLE = await token.MINTER_ROLE();
  const hasMinterRole = await token.hasRole(MINTER_ROLE, signer.address);

  console.log("Your wallet:", signer.address);
  console.log("Has MINTER_ROLE:", hasMinterRole);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
