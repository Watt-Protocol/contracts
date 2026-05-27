# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.1] - 2026-05-10

### Fixed

- **HH117 empty RPC URL:** `hardhat.config.js` now falls back to public Base RPC endpoints when `BASE_SEPOLIA_RPC_URL` / `BASE_MAINNET_RPC_URL` are unset or blank.
- **Verify on empty placeholders:** `scripts/verify.js` exits with a clear message if `deployments/*.json` still contains empty contract addresses (run deploy first).

### Added

- **`contracts/legacy/WattToken.sol`:** archived single-file token (Solidity 0.8.20) for transparency and optional BaseScan verification of older Sepolia deployments.
- **`scripts/verify-legacy-watt.js`** and `npm run verify:legacy-watt` for legacy address verification.
- **Dual Solidity compilers** (0.8.24 + 0.8.20) in Hardhat config.
- **README** troubleshooting for deploy/verify and legacy token explanation.

### Changed

- **`deployments/base-sepolia.json`:** legacy section documents multiple example WattToken Sepolia addresses including `0x342b847c2Da851D902Ad492b2405D317811A86AD`.

## [0.2.0] - 2026-05-10

### Added

- Hardhat project (`hardhat.config.js`, `package.json`) targeting Solidity **0.8.24**, Base and Base Sepolia.
- `WATTToken.sol`: ERC-20 with `AccessControl`, `ERC20Pausable`, `MINTER_ROLE`, capped supply, `mintForVerifiedEnergy` gated by `MeterRegistry`.
- `MeterRegistry.sol`: meter lifecycle with `REGISTRAR_ROLE`, deactivate / reactivate.
- `Treasury.sol`: native and ERC-20 withdrawals with `WITHDRAWER_ROLE` and `ReentrancyGuard`.
- `scripts/deploy.js`, `scripts/verify.js`, `scripts/mint-test.js` (Sepolia-only helper).
- `deployments/` JSON placeholders and `deployments/README.md` for reproducible addressing.
- Unit and integration tests under `test/`.
- Community files: `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `LICENSE` (MIT), `.env.example`, `.gitignore`.

### Changed

- Replaced legacy `WattToken.sol` (single-file Ownable token) with the modular layout above. **Bytecode and addresses differ** from the pre-restructure Base Sepolia deployment; see `deployments/base-sepolia.json` `legacy` field.

### Removed

- `contracts/WattToken.sol` (superseded by `WATTToken.sol`).

[0.2.1]: https://github.com/watt-protocol/contracts
[0.2.0]: https://github.com/watt-protocol/contracts
