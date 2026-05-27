# WATT Protocol — Smart Contracts

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Core on-chain logic for **$WATT**, the **meter registry**, and **treasury** on **Base** and **Base Sepolia**.

Contract addresses and verification steps: [`deployments/`](deployments/). Secrets only via `.env` ([`.env.example`](.env.example)).

## 🔋 Utility flow

1. Smart meters sign kWh telemetry at the edge (firmware and backend layers are separate repositories under the WATT licensing matrix).
2. The protocol verifies cryptographic proofs and governance policy off-chain.
3. **$WATT** is minted on-chain only by authorised minters, proportionally to **whole verified kWh** (see `WATTToken.mintForVerifiedEnergy`), with the meter **active** in `MeterRegistry`.
4. Tokens and native assets flow to **Treasury** and partner programmes for **verifiable ESG impact** and **funder transparency** (on-chain balances and events; operational reporting complements this).

## 🛠️ Tech stack

- **Solidity** `^0.8.24` (current system) and **0.8.20** (archived legacy `WattToken` only)
- **Hardhat** + **@nomicfoundation/hardhat-toolbox**
- **OpenZeppelin Contracts** (ERC-20, `AccessControl`, `Pausable`, `ReentrancyGuard`)
- **Base** (chain id 8453) and **Base Sepolia** (84532)
- Gas-conscious patterns: custom errors, immutable registry reference, optimizer runs 200

## Related repositories

| Repo | Role |
|------|------|
| [server](https://github.com/Watt-Protocol/server) | API + Supabase migrations |
| [watt-minter](https://github.com/Watt-Protocol/watt-minter) | Payouts |
| [meter-firmware](https://github.com/Watt-Protocol/meter-firmware) | Telemetry |
| [meter-app](https://github.com/Watt-Protocol/meter-app) | Mobile UI |

## Repository layout

- **`contracts/`** — `WATTToken.sol`, `MeterRegistry.sol`, `Treasury.sol`, `interfaces/`, `legacy/WattToken.sol` (frozen reference for older Sepolia deployments)
- **`test/`** — Hardhat + Chai tests
- **`scripts/`** — `deploy.js`, `verify.js`, `verify-legacy-watt.js`, `mint-test.js` (Sepolia helper)
- **`deployments/`** — Canonical addresses per network (JSON)

## 🚀 Quick start

```bash
git clone https://github.com/Watt-Protocol/contracts.git
cd contracts && npm install
npx hardhat compile
npx hardhat test
```

Deploy to Base Sepolia:

1. Copy `.env.example` to `.env`.
2. Set **`DEPLOYER_PRIVATE_KEY`** to a funded Base Sepolia wallet (0x-prefixed key).
3. Optionally set **`BASE_SEPOLIA_RPC_URL`**; if you leave it blank, Hardhat uses the public default `https://sepolia.base.org` (avoids `HH117` empty URL errors).
4. For verification, set **`BASESCAN_API_KEY`** from [BaseScan API keys](https://basescan.org/myapikey).

```bash
npm run deploy:base-sepolia
npm run verify:base-sepolia
```

Optional testnet smoke script **after** a successful deploy (needs real addresses in `deployments/base-sepolia.json`):

```bash
npm run mint-test:base-sepolia
```

## Troubleshooting deploy / verify

- **`HH117: Empty string for network or forking URL`** — Your `.env` had `BASE_SEPOLIA_RPC_URL=` (empty). Either set a real RPC URL or **delete that line**: Hardhat now defaults to `https://sepolia.base.org` when the variable is blank (see `hardhat.config.js`).
- **`Missing DEPLOYER_PRIVATE_KEY`** — Live networks need a funded deployer. Copy `.env.example` to `.env` and set `DEPLOYER_PRIVATE_KEY` (0x-prefixed testnet key).
- **`InvalidAddressError` / empty address on verify** — `deployments/base-sepolia.json` still had **empty** placeholder addresses. **Deploy must succeed first** so `deploy.js` overwrites that file with real `MeterRegistry`, `WATTToken`, and `Treasury` addresses; only then run `npm run verify:base-sepolia`.
- **Verify API / auth errors** — Set `BASESCAN_API_KEY` in `.env` ([BaseScan](https://basescan.org/myapikey)).

## Legacy single-file `WattToken` on Base Sepolia

The modular **`WATTToken`** + **`MeterRegistry`** + **`Treasury`** system **replaces** the earlier standalone **`WattToken`** contract for new work. Your earlier deployment remains a **valid historical contract** on-chain; removing the file from git did not change that address.

- Example legacy deployment: [`0x342b847c2Da851D902Ad492b2405D317811A86AD`](https://sepolia.basescan.org/address/0x342b847c2Da851D902Ad492b2405D317811A86AD)
- Archived source (for transparency / verification attempts): [`contracts/legacy/WattToken.sol`](contracts/legacy/WattToken.sol)

To try BaseScan verification for a **legacy** address (constructor has **no arguments**):

```bash
export BASESCAN_API_KEY=your_key
LEGACY_WATT_TOKEN_ADDRESS=0x342b847c2Da851D902Ad492b2405D317811A86AD npm run verify:legacy-watt -- --network base-sepolia
```

If verification says “bytecode mismatch”, the live contract was compiled with **different compiler settings or OpenZeppelin version** than this archive. In that case, match the exact compiler/OZ version used for that deployment, or verify using the “Contract creation code” path on BaseScan with the original artifact.

## 📄 License and compliance

This repository is licensed under the **MIT License** — see [LICENSE](LICENSE). SPDX license identifiers are included in each Solidity file. Security disclosures: [SECURITY.md](SECURITY.md). Contribution terms: [CONTRIBUTING.md](CONTRIBUTING.md).

**Funder transparency:** deployment JSON files record which revision produced which addresses; verify source on BaseScan using the scripts above.

## Trademark

“WATT Protocol”, “$WATT”, associated logos, and related marks are **trademarks of WATT Protocol Limited**. MIT licensed code does **not** grant rights to use those marks in a way that suggests endorsement, affiliation, or official status. Refer to your counsel and WATT’s brand guidelines for permitted use.

## Deployed addresses

Authoritative per-network records: [`deployments/base-sepolia.json`](deployments/base-sepolia.json), [`deployments/base.json`](deployments/base.json). See the `legacy` section in `base-sepolia.json` for earlier WattToken-only explorer links.

## Documentation

- Technical on-chain overview: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- Repository scope and non-contract docs: [`docs/README.md`](docs/README.md)

## Community

- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- [CHANGELOG.md](CHANGELOG.md)
