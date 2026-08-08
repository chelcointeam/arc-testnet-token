// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title MyToken — simple ERC-20 token deployed on Arc Testnet
/// @notice Demonstrates basic token deployment on Circle's Arc L1 blockchain
/// @dev Uses OpenZeppelin ERC20 + Ownable. Only owner can mint new tokens.
contract MyToken is ERC20, Ownable {
    /// @param initialSupply Number of tokens to mint to deployer (without decimals)
    constructor(uint256 initialSupply)
        ERC20("MyToken", "MTK")
        Ownable(msg.sender)
    {
        _mint(msg.sender, initialSupply * (10 ** decimals()));
    }

    /// @notice Mint new tokens to a specified address
    /// @dev Only callable by contract owner
    /// @param to Recipient address
    /// @param amount Number of tokens to mint (without decimals)
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount * (10 ** decimals()));
    }
}
