# Security policy

WATT Protocol takes the security of its smart contracts and users seriously.

## Supported versions

Security fixes are applied to the default branch of this repository (`main`). Deployed contracts may lag the repository; always verify addresses in [`deployments/`](deployments/) against the tagged release you intend to audit.

## Reporting a vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, report details to the maintainers privately:

- **Email:** security@wattprotocol.io *(replace with your operational security inbox if different)*

Include:

- A description of the issue and its potential impact
- Steps to reproduce, proof-of-concept if available, and affected contract(s) / network
- Whether you believe the issue is already exploitable on-chain

We aim to acknowledge receipt within **72 hours** and to coordinate disclosure once a mitigation path exists.

## Scope

In scope: Solidity contracts in this repository, deployment scripts that affect fund safety, and Hardhat configuration that could weaken deployments.

Out of scope: third-party front-ends, marketing websites, social media, or unrelated repositories unless explicitly linked from this repo’s documentation.

## Bug bounty

A public bug bounty (for example via Immunefi) may be announced separately. Until then, coordinated disclosure via the contact above is appreciated.

## Safe harbour

If you make a good faith effort to comply with this policy during your research, we will not pursue legal action against you. Always comply with applicable law and do not access data or systems without authorisation.
