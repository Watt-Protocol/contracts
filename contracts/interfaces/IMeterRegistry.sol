// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IMeterRegistry
 * @notice Minimal view interface for {WATTToken} meter gating.
 */
interface IMeterRegistry {
    function isMeterActive(bytes32 meterId) external view returns (bool);
}
