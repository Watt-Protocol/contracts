// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title MeterRegistry
 * @notice On-chain registry of smart meters authorised in the WATT minting path.
 * @dev Registrar is typically a multisig or protocol role, not a hot minter key.
 */
contract MeterRegistry is AccessControl {
    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");

    struct Meter {
        bool exists;
        bool active;
        string metadataURI;
    }

    mapping(bytes32 meterId => Meter) private _meters;

    event MeterRegistered(bytes32 indexed meterId, string metadataURI, address indexed registrar);
    event MeterUpdated(bytes32 indexed meterId, string metadataURI, address indexed registrar);
    event MeterDeactivated(bytes32 indexed meterId, address indexed registrar);
    event MeterReactivated(bytes32 indexed meterId, address indexed registrar);

    error MeterAlreadyExists(bytes32 meterId);
    error MeterUnknown(bytes32 meterId);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(REGISTRAR_ROLE, admin);
    }

    /**
     * @notice Register a new meter id. Id is usually a hash of device pubkey / serial policy off-chain.
     */
    function registerMeter(bytes32 meterId, string calldata metadataURI) external onlyRole(REGISTRAR_ROLE) {
        Meter storage m = _meters[meterId];
        if (m.exists) {
            revert MeterAlreadyExists(meterId);
        }
        m.exists = true;
        m.active = true;
        m.metadataURI = metadataURI;
        emit MeterRegistered(meterId, metadataURI, msg.sender);
    }

    /**
     * @notice Update metadata URI for an existing active meter.
     */
    function setMeterMetadata(bytes32 meterId, string calldata metadataURI) external onlyRole(REGISTRAR_ROLE) {
        Meter storage m = _meters[meterId];
        if (!m.exists) revert MeterUnknown(meterId);
        m.metadataURI = metadataURI;
        emit MeterUpdated(meterId, metadataURI, msg.sender);
    }

    /**
     * @notice Deactivate a meter so it can no longer be used in verified mints.
     */
    function deactivateMeter(bytes32 meterId) external onlyRole(REGISTRAR_ROLE) {
        Meter storage m = _meters[meterId];
        if (!m.exists || !m.active) revert MeterUnknown(meterId);
        m.active = false;
        emit MeterDeactivated(meterId, msg.sender);
    }

    /**
     * @notice Re-enable a previously deactivated meter.
     */
    function reactivateMeter(bytes32 meterId) external onlyRole(REGISTRAR_ROLE) {
        Meter storage m = _meters[meterId];
        if (!m.exists || m.active) revert MeterUnknown(meterId);
        m.active = true;
        emit MeterReactivated(meterId, msg.sender);
    }

    function isMeterActive(bytes32 meterId) external view returns (bool) {
        Meter storage m = _meters[meterId];
        return m.exists && m.active;
    }

    function getMeter(bytes32 meterId) external view returns (bool exists, bool active, string memory metadataURI) {
        Meter storage m = _meters[meterId];
        return (m.exists, m.active, m.metadataURI);
    }
}
