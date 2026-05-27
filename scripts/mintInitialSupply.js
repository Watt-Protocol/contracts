const { ethers } = require("hardhat");

async function main() {
  const TOKEN_ADDRESS = "0xf07ce10cE718fEe22dFEe06B4048B734bC95b954";
  const [signer] = await ethers.getSigners();
  console.log("Using wallet:", signer.address);

  const abi = [
    "function mint(address to, uint256 amount) external",
    "function totalSupply() view returns (uint256)",
    "function hasRole(bytes32 role, address account) view returns (bool)",
    "function MINTER_ROLE() view returns (bytes32)",
    "function grantRole(bytes32 role, address account) external"
  ];

  const token = new ethers.Contract(TOKEN_ADDRESS, abi, signer);

  const totalSupply = await token.totalSupply();
  console.log("Current supply:", ethers.formatUnits(totalSupply, 18));

  let minterRole;
  try {
    minterRole = await token.MINTER_ROLE();
  } catch {
    minterRole = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
  }

  const hasRole = await token.hasRole(minterRole, signer.address);
  console.log("Has MINTER_ROLE:", hasRole);

  if (!hasRole) {
    console.log("Granting MINTER_ROLE to self...");
    const tx0 = await token.grantRole(minterRole, signer.address);
    await tx0.wait();
    console.log("Role granted!");
  }

  const amount = ethers.parseUnits("999999980", 18);
  console.log("Minting 999,999,980 WATT...");
  const tx = await token.mint(signer.address, amount);
  await tx.wait();

  const newSupply = await token.totalSupply();
  console.log("Done! New total supply:", ethers.formatUnits(newSupply, 18));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
