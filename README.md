# Arc Testnet Token & Monitoring Tool

![Arc Testnet](https://img.shields.io/badge/network-Arc%20Testnet-blue)
![Status](https://img.shields.io/badge/status-deployed-brightgreen)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

Simple ERC-20 token deployed on Circle's Arc Testnet, plus a Python monitoring tool for tracking wallet balances.

## Contract Details

| Field | Value |
|---|---|
| Contract Address | `0x2D30Fe563d780Be98422044733FeFFD8F0FC245C` |
| Network | Arc Testnet |
| Chain ID | 5042002 |
| RPC URL | https://rpc.testnet.arc.network |
| Explorer | [View on Arcscan](https://testnet.arcscan.app/address/0x2D30Fe563d780Be98422044733FeFFD8F0FC245C) |

## Tech Stack
- Solidity ^0.8.20, OpenZeppelin Contracts
- Deployed via Remix IDE + MetaMask
- Python (web3.py) for balance monitoring

## Files
- `MyToken.sol` — ERC-20 token contract with mint function (owner-only)
- `monitor.py` — polls wallet balance every 60s, logs to CSV

## How to run the monitor
\`\`\`bash
pip install web3
python monitor.py
\`\`\`

## Screenshots
(add screenshot of successful deploy in Remix, and Arcscan transaction page)
