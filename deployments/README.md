# Deployments

Each file records **verified** contract addresses for a network after `scripts/deploy.js` runs.

## Files

- **`base-sepolia.json`** — Base Sepolia, chain id **84532**
- **`base.json`** — Base mainnet, chain id **8453**

## Schema

- `network` — Hardhat network name
- `chainId` — EIP-155 chain id
- `deployer` — Address that deployed the set
- `timestamp` — ISO-8601 time of deployment write
- `contracts` — Named addresses (`MeterRegistry`, `WATTToken`, `Treasury`)
- `legacy` (optional) — Prior deployments for auditor transparency

## Update process

1. Configure `.env` from `.env.example` (never commit secrets).
2. Run `npm run deploy:base-sepolia` or `npm run deploy:base`.
3. Commit the updated JSON; run `npm run verify:base-sepolia` (or `verify:base`) to publish source on BaseScan.

**Open for audit • Reproducible deployment:** same bytecode can be reproduced from this git revision; addresses and verification links live here and in the root README.
