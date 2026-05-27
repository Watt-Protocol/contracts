// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title Treasury
 * @notice Holds native gas token and ERC-20 (e.g. $WATT) for community / ESG programmes with auditable withdrawals.
 */
contract Treasury is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant WITHDRAWER_ROLE = keccak256("WITHDRAWER_ROLE");

    event NativeWithdrawal(address indexed to, uint256 amount, address indexed caller);
    event ERC20Withdrawal(address indexed token, address indexed to, uint256 amount, address indexed caller);

    error NativeTransferFailed();

    constructor(address admin, address withdrawer) {
        require(admin != address(0), "Treasury: admin");
        require(withdrawer != address(0), "Treasury: withdrawer");
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(WITHDRAWER_ROLE, withdrawer);
    }

    receive() external payable {}

    function withdrawNative(address payable to, uint256 amount)
        external
        onlyRole(WITHDRAWER_ROLE)
        nonReentrant
    {
        (bool ok,) = to.call{value: amount}("");
        if (!ok) revert NativeTransferFailed();
        emit NativeWithdrawal(to, amount, msg.sender);
    }

    function withdrawERC20(address token, address to, uint256 amount)
        external
        onlyRole(WITHDRAWER_ROLE)
        nonReentrant
    {
        IERC20(token).safeTransfer(to, amount);
        emit ERC20Withdrawal(token, to, amount, msg.sender);
    }
}
