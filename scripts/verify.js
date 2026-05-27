const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

const MAX_SUPPLY = 1_000_000_000n * 10n ** 18n;

function deploymentPath(network) {
  if (network === "base-sepolia") return "base-sepolia.json";
  if (network === "base") return "base.json";
  return `${network}.json`;
}

function isDeployedAddress(a) {
  return typeof a === "string" && hre.ethers.isAddress(a) && a !== hre.ethers.ZeroAddress;
}

async function main() {
  const network = hre.network.name;
  const file = path.join(__dirname, "..", "deployments", deploymentPath(network));
  if (!fs.existsSync(file)) {
    throw new Error(`Missing ${file}. Run deploy for this network first.`);
  }
  const d = JSON.parse(fs.readFileSync(file, "utf8"));
  const admin = d.deployer;
  const { MeterRegistry: regAddr, WATTToken: tokenAddr, Treasury: treasuryAddr } = d.contracts;

  if (!isDeployedAddress(regAddr) || !isDeployedAddress(tokenAddr) || !isDeployedAddress(treasuryAddr)) {
    console.error(
      "deployments file still has empty placeholder addresses. Run a successful deploy first:\n" +
        "  npm run deploy:base-sepolia\n" +
        "That will overwrite deployments/base-sepolia.json with real contract addresses.\n" +
        "Then run verify again."
    );
    process.exit(1);
  }

  if (!(admin && hre.ethers.isAddress(admin))) {
    console.error("deployments JSON has invalid deployer address.");
    process.exit(1);
  }

  const apiKey = (process.env.BASESCAN_API_KEY || "").trim();
  if (!apiKey) {
    console.error(
      "Missing BASESCAN_API_KEY in .env. Create a free key at https://basescan.org/myapikey then retry."
    );
    process.exit(1);
  }

  console.log("Verifying MeterRegistry", regAddr);
  await hre.run("verify:verify", {
    address: regAddr,
    constructorArguments: [admin],
  });

  console.log("Verifying WATTToken", tokenAddr);
  await hre.run("verify:verify", {
    address: tokenAddr,
    constructorArguments: [admin, regAddr, MAX_SUPPLY, "WATT Protocol", "WATT"],
  });

  console.log("Verifying Treasury", treasuryAddr);
  await hre.run("verify:verify", {
    address: treasuryAddr,
    constructorArguments: [admin, admin],
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
