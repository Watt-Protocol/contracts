require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const DEFAULT_BASE_SEPOLIA_RPC = "https://sepolia.base.org";
const DEFAULT_BASE_MAINNET_RPC = "https://mainnet.base.org";

function pickRpc(envValue, fallback) {
  const v = (envValue || "").trim();
  return v.length > 0 ? v : fallback;
}

/**
 * @returns {string[]} Hardhat accounts array, or empty if unset.
 */
function accountsFromPrivateKeyEnv() {
  const raw = (process.env.DEPLOYER_PRIVATE_KEY || "").trim();
  if (!raw) return [];
  const hex = raw.startsWith("0x") || raw.startsWith("0X") ? raw.slice(2) : raw;
  if (!/^[0-9a-fA-F]+$/u.test(hex)) {
    throw new Error(
      "DEPLOYER_PRIVATE_KEY must be hex only (optional 0x prefix). Remove spaces, quotes, or newlines."
    );
  }
  if (hex.length === 40) {
    throw new Error(
      "DEPLOYER_PRIVATE_KEY looks like an Ethereum ADDRESS (20 bytes). " +
        "You need the wallet SECRET key (32 bytes = 64 hex characters after 0x). " +
        "MetaMask: Account details → Show private key (use a testnet-only wallet on Sepolia)."
    );
  }
  if (hex.length !== 64) {
    throw new Error(
      `DEPLOYER_PRIVATE_KEY must be exactly 64 hex digits (32 bytes). Found ${hex.length}. ` +
        "Do not use a contract address, seed phrase, or truncated key."
    );
  }
  const key = raw.startsWith("0x") || raw.startsWith("0X") ? raw : `0x${hex}`;
  return [key];
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {
          optimizer: { enabled: true, runs: 200 },
        },
      },
      {
        version: "0.8.20",
        settings: {
          optimizer: { enabled: true, runs: 200 },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    "base-sepolia": {
      url: pickRpc(process.env.BASE_SEPOLIA_RPC_URL, DEFAULT_BASE_SEPOLIA_RPC),
      accounts: accountsFromPrivateKeyEnv(),
      chainId: 84532,
    },
    base: {
      url: pickRpc(process.env.BASE_MAINNET_RPC_URL, DEFAULT_BASE_MAINNET_RPC),
      accounts: accountsFromPrivateKeyEnv(),
      chainId: 8453,
    },
  },
  etherscan: {
    apiKey: {
      "base-sepolia": process.env.BASESCAN_API_KEY || "",
      base: process.env.BASESCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "base-sepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org",
        },
      },
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
