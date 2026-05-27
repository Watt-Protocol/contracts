/**
 * Verify the *legacy* single-file WattToken on Base Sepolia (Solidity 0.8.20).
 * Usage after deploy is NOT needed for the new system — only for older addresses
 * such as 0x342b847c2Da851D902Ad492b2405D317811A86AD when source was not yet on BaseScan.
 *
 *   LEGACY_WATT_TOKEN_ADDRESS=0x342b847c2Da851D902Ad492b2405D317811A86AD npm run verify:legacy-watt -- --network base-sepolia
 */
const hre = require("hardhat");

async function main() {
  const addr = (process.env.LEGACY_WATT_TOKEN_ADDRESS || "").trim();
  if (!addr || !hre.ethers.isAddress(addr)) {
    console.error(
      "Set LEGACY_WATT_TOKEN_ADDRESS to the WattToken proxy/implementation you want verified, e.g.:\n" +
        "  LEGACY_WATT_TOKEN_ADDRESS=0x342b847c2Da851D902Ad492b2405D317811A86AD npm run verify:legacy-watt -- --network base-sepolia"
    );
    process.exit(1);
  }

  if (!(process.env.BASESCAN_API_KEY || "").trim()) {
    console.error("Missing BASESCAN_API_KEY in .env.");
    process.exit(1);
  }

  console.log("Verifying legacy WattToken at", addr);
  await hre.run("verify:verify", {
    address: addr,
    contract: "contracts/legacy/WattToken.sol:WattToken",
    constructorArguments: [],
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
