# On-chain architecture (contracts)

This document describes the **MIT-licensed Solidity** components in this repository. It is **not** legal or investment advice.

## Components

### MeterRegistry

- Stores **meter identifiers** (`bytes32`, typically a hash derived from device identity policy off-chain) and an optional **metadata URI** (for example IPFS) for transparency.
- **`REGISTRAR_ROLE`** adds, updates, deactivates, and reactivates meters. **`DEFAULT_ADMIN_ROLE`** manages roles.
- `isMeterActive` is the on-chain gate used by `WATTToken.mintForVerifiedEnergy`.

### WATTToken

- Standard **ERC-20** with **18 decimals**, **pausable** transfers and mints, and **OpenZeppelin `AccessControl`**.
- **`MINTER_ROLE`**: may call `mint` (general issuance within cap) or `mintForVerifiedEnergy(meterId, producer, kwhWhole)` which requires the meter to be active in `MeterRegistry`.
- **`PAUSER_ROLE`**: emergency pause.
- **`maxSupply`**: immutable cap set at deployment (1e9 × 1e18 for production deploy script; tests use a lower cap).

### Treasury

- Holds **ETH** (Base native gas token) and **ERC-20** balances.
- **`WITHDRAWER_ROLE`** moves funds to approved recipients; events log every withdrawal for **funder-visible** accounting.

## Trust boundaries

- **Whoever holds `MINTER_ROLE`** can mint up to the cap. Operational security should move this role to a multisig, timelock, or dedicated minter contract controlled by the protocol team.
- **Registrar** and **withdrawer** roles should likewise be multisigs for production.
- Cryptographic verification of meter telemetry happens **off-chain** (protocol server, AGPL layer in the WATT matrix). On-chain code trusts **roles** and **registry state**, not raw meter payloads.

## SPDX

Solidity files use `SPDX-License-Identifier: MIT` per file, matching the repository `LICENSE`.
