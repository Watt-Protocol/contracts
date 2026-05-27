const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

const MAX_SUPPLY = 1_000_000_000n * 10n ** 18n;

async function main() {
  const net = hre.network.name;
  if (net === "base-sepolia" || net === "base") {
    const pk = (process.env.DEPLOYER_PRIVATE_KEY || "").trim();
    if (!pk) {
      console.error(
        "Missing DEPLOYER_PRIVATE_KEY. Copy .env.example to .env and set a funded wallet key for this network."
      );
      process.exit(1);
    }
  }

  const [deployer] = await hre.ethers.getSigners();
  if (!deployer) {
    console.error("No deployer signer. Set DEPLOYER_PRIVATE_KEY in .env for live networks.");
    process.exit(1);
  }
  const admin = deployer.address;

  const MeterRegistry = await hre.ethers.getContractFactory("MeterRegistry");
  const registry = await MeterRegistry.deploy(admin);
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();

  const WATTToken = await hre.ethers.getContractFactory("WATTToken");
  const token = await WATTToken.deploy(
    admin,
    registryAddress,
    MAX_SUPPLY,
    "WATT Protocol",
    "WATT"
  );
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();

  const Treasury = await hre.ethers.getContractFactory("Treasury");
  const treasury = await Treasury.deploy(admin, admin);
  await treasury.waitForDeployment();
  const treasuryAddress = await treasury.getAddress();

  const network = hre.network.name;
  const nc = await hre.ethers.provider.getNetwork();
  const chainId = Number(nc.chainId);

  const deployment = {
    network,
    chainId,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      MeterRegistry: registryAddress,
      WATTToken: tokenAddress,
      Treasury: treasuryAddress,
    },
  };

  if (network === "base-sepolia") {
    deployment.legacy = {
      note:
        "Earlier single-file WattToken deployments (different bytecode from WATTToken + MeterRegistry + Treasury). Source reference: contracts/legacy/WattToken.sol",
      WattToken_Sepolia_examples: [
        {
          address: "0x342b847c2Da851D902Ad492b2405D317811A86AD",
          explorer: "https://sepolia.basescan.org/address/0x342b847c2Da851D902Ad492b2405D317811A86AD",
        },
        {
          address: "0xf07ce10cE718fEe22dFEe06B4048B734bC95b954",
          explorer: "https://sepolia.basescan.org/address/0xf07ce10cE718fEe22dFEe06B4048B734bC95b954",
        },
      ],
    };
  }

  const outDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const fileName =
    network === "base-sepolia"
      ? "base-sepolia.json"
      : network === "base"
        ? "base.json"
        : `${network}.json`;

  fs.writeFileSync(path.join(outDir, fileName), JSON.stringify(deployment, null, 2));
  console.log("Wrote", path.join("deployments", fileName));
  console.log(JSON.stringify(deployment.contracts, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
