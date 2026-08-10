// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title ArcToken — pausable, burnable ERC-20 for Arc Testnet payment-flow testing
/// @notice Simulates a real payment token: mint → transfer → burn lifecycle
///         on Circle's Arc L1 (USDC-as-gas). Owner can pause all transfers
///         to test circuit-breaker behaviour in payment integrations.
/// @dev Inherits OZ ERC20Burnable and ERC20Pausable.
contract ArcToken is ERC20, ERC20Burnable, ERC20Pausable, Ownable {
    // -----------------------------------------------------------------------
    // Events
    // -----------------------------------------------------------------------

    /// @notice Emitted when owner pauses all token transfers
    event ContractPaused(address indexed by);
    /// @notice Emitted when owner unpauses token transfers
    event ContractUnpaused(address indexed by);

    // -----------------------------------------------------------------------
    // Constructor
    // -----------------------------------------------------------------------

    /// @param initialSupply Tokens minted to deployer (human-readable, 18 dec applied)
    constructor(uint256 initialSupply)
        ERC20("ArcToken", "ARC")
        Ownable(msg.sender)
    {
        _mint(msg.sender, initialSupply * (10 ** decimals()));
    }

    // -----------------------------------------------------------------------
    // Owner-only actions
    // -----------------------------------------------------------------------

    /// @notice Mint new tokens to any address
    /// @dev Only owner; useful to seed merchant / escrow wallets in tests
    /// @param to Recipient address
    /// @param amount Human-readable amount (decimals applied internally)
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount * (10 ** decimals()));
    }

    /// @notice Pause all token transfers (circuit-breaker for payment testing)
    function pause() external onlyOwner {
        _pause();
        emit ContractPaused(msg.sender);
    }

    /// @notice Resume token transfers
    function unpause() external onlyOwner {
        _unpause();
        emit ContractUnpaused(msg.sender);
    }

    // -----------------------------------------------------------------------
    // Overrides required by Solidity multiple-inheritance
    // -----------------------------------------------------------------------

    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20, ERC20Pausable) {
        super._update(from, to, value);
    }
}
