const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * Testnet helper: register a demo meter and mint verified-energy tokens.
 * Requires deployments/base-sepolia.json from a prior deploy and DEPLOYER_PRIVATE_KEY with MINTER_ROLE (default admin).
 */
async function main() {
  const nc = await hre.ethers.provider.getNetwork();
  if (nc.chainId !== 84532n) {
    console.error("mint-test.js is restricted to Base Sepolia (chainId 84532).");
    process.exit(1);
  }

  const file = path.join(__dirname, "..", "deployments", "base-sepolia.json");
  if (!fs.existsSync(file)) {
    console.error("Missing deployments/base-sepolia.json. Run: npm run deploy:base-sepolia");
    process.exit(1);
  }

  const d = JSON.parse(fs.readFileSync(file, "utf8"));
  const [signer] = await hre.ethers.getSigners();
  if (signer.address.toLowerCase() !== d.deployer.toLowerCase()) {
    console.warn(
      `Warning: signer ${signer.address} is not recorded deployer ${d.deployer}. Minter role may be missing.`
    );
  }

  const registry = await hre.ethers.getContractAt("MeterRegistry", d.contracts.MeterRegistry);
  const token = await hre.ethers.getContractAt("WATTToken", d.contracts.WATTToken);

  const demoMeterId = hre.ethers.id("watt-demo-meter-" + Date.now());
  const tx1 = await registry.registerMeter(demoMeterId, "ipfs://demo-meter-metadata");
  await tx1.wait();
  console.log("Registered meter", demoMeterId);

  const producer = signer.address;
  const kwh = 1n;
  const tx2 = await token.mintForVerifiedEnergy(demoMeterId, producer, kwh);
  await tx2.wait();
  console.log("Minted", kwh.toString(), "kWh worth of WATT to", producer);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
