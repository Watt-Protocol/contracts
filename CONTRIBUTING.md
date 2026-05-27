# Contributing to WATT Protocol contracts

Thank you for helping improve the on-chain layer of WATT Protocol. This repository contains Solidity contracts and Hardhat tooling only.

## Principles

- Prefer small, reviewable pull requests with a clear description of behaviour change and risk.
- Match existing code style: SPDX headers, NatSpec on public functions where behaviour is non-obvious, minimal comments.
- Do not commit secrets, private keys, or `.env` files. Use `.env.example` as the template.

## Development

```bash
npm install
npx hardhat compile
npx hardhat test
```

## Security

If you believe you have found a security vulnerability, **do not** open a public issue. Follow [SECURITY.md](SECURITY.md).

## Licensing

By contributing, you agree that your contributions are licensed under the **MIT License** (see [LICENSE](LICENSE)), consistent with the WATT Protocol public smart-contracts strategy.

## Trademark

“WATT Protocol”, “$WATT”, and associated marks are trademarks of WATT Protocol Limited. Do not imply endorsement or official status without written permission. See the root README for the full notice.
