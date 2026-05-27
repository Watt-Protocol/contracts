// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Pausable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IMeterRegistry} from "./interfaces/IMeterRegistry.sol";

/**
 * @title WATTToken
 * @notice ERC-20 utility token for verified renewable generation on Base.
 * @dev 1 token (18 decimals) per 1 whole verified kWh in {mintForVerifiedEnergy}.
 *      Fractional kWh should be accumulated off-chain before mint.
 */
contract WATTToken is ERC20, ERC20Pausable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    uint256 public immutable maxSupply;
    IMeterRegistry public immutable meterRegistry;

    error ExceedsMaxSupply(uint256 requested, uint256 remaining);
    error InactiveMeter(bytes32 meterId);

    constructor(
        address admin,
        address registry,
        uint256 maxSupply_,
        string memory name_,
        string memory symbol_
    ) ERC20(name_, symbol_) {
        require(admin != address(0), "WATT: admin");
        require(registry != address(0), "WATT: registry");
        require(maxSupply_ > 0, "WATT: maxSupply");
        maxSupply = maxSupply_;
        meterRegistry = IMeterRegistry(registry);

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
    }

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /**
     * @notice Mint arbitrary amount to `to` (treasury bootstrap, liquidity, etc.).
     */
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) whenNotPaused {
        _mintCapped(to, amount);
    }

    /**
     * @notice Mint for verified kWh: requires meter active in {MeterRegistry}.
     * @param kwhWhole Whole kilowatt-hours (off-chain verifier rounds policy).
     */
    function mintForVerifiedEnergy(bytes32 meterId, address producer, uint256 kwhWhole)
        external
        onlyRole(MINTER_ROLE)
        whenNotPaused
    {
        if (!meterRegistry.isMeterActive(meterId)) {
            revert InactiveMeter(meterId);
        }
        uint256 amount = kwhWhole * 10 ** decimals();
        _mintCapped(producer, amount);
    }

    function _mintCapped(address to, uint256 amount) internal {
        uint256 supply = totalSupply();
        if (supply + amount > maxSupply) {
            revert ExceedsMaxSupply(amount, maxSupply - supply);
        }
        _mint(to, amount);
    }

    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Pausable) {
        super._update(from, to, value);
    }
}
