// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title WattToken (legacy, frozen reference)
 * @notice Original single-contract deployment used on Base Sepolia before the
 *         modular WATTToken + MeterRegistry + Treasury layout. Kept for
 *         source transparency and BaseScan verification of older addresses.
 * @dev Compile with Solidity 0.8.20 (see hardhat.config.js). Do not use for new deployments.
 */

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract WattToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10 ** 18;

    constructor() ERC20("WATT Protocol", "WATT") Ownable(msg.sender) {}

    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }

    function mintForEnergy(address producer, uint256 kwhVerified) external onlyOwner {
        uint256 tokensToMint = kwhVerified * 10 ** 18;
        require(totalSupply() + tokensToMint <= MAX_SUPPLY, "Exceeds max supply");
        _mint(producer, tokensToMint);
    }
}
