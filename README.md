# Arc Testnet Token & Monitoring Tool

![Arc Testnet](https://img.shields.io/badge/network-Arc%20Testnet-blue)
![Status](https://img.shields.io/badge/status-deployed-brightgreen)
![Solidity](https://img.shields.io/badge/solidity-^0.8.20-363636)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

A simple ERC-20 token deployed on Circle's **Arc Testnet** — a stablecoin-native Layer-1 blockchain using USDC as gas. Includes a Python monitoring tool for tracking wallet USDC balance in real time.

## Contract Details

| Field | Value |
|---|---|
| Contract Address | [`0x2D30Fe563d780Be98422044733FeFFD8F0FC245C`](https://testnet.arcscan.app/address/0x2D30Fe563d780Be98422044733FeFFD8F0FC245C) |
| Token Name | MyToken (MTK) |
| Network | Arc Testnet |
| Chain ID | 5042002 |
| RPC URL | https://rpc.testnet.arc.network |
| Explorer | [View on Arcscan](https://testnet.arcscan.app/address/0x2D30Fe563d780Be98422044733FeFFD8F0FC245C) |

## Tech Stack

- **Solidity** ^0.8.20 + OpenZeppelin Contracts (ERC20, Ownable)
- Deployed via **Remix IDE** + MetaMask (Injected Provider)
- **Python** 3.x + web3.py for balance monitoring

## Files

| File | Description |
|---|---|
| `MyToken.sol` | ERC-20 token contract with owner-only `mint()` function |
| `monitor.py` | Polls wallet USDC balance every 60s via RPC, logs to CSV |
| `balance_log.csv` | Auto-generated balance log (timestamp, balance) |

## How to Run the Monitor

```bash
pip install web3
python monitor.py
```

The script connects to Arc Testnet RPC, checks the wallet balance every 60 seconds and appends results to `balance_log.csv`.

## Next Steps

- Add `burn()` function to MyToken.sol to allow token destruction by holder
- Write Hardhat unit tests for `mint()` and `burn()` functions
- Extend `monitor.py` with Telegram bot notifications on balance changes

## License

MIT
