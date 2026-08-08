# Arc Testnet Token & Monitoring Tool

![Arc Testnet](https://img.shields.io/badge/network-Arc%20Testnet-blue)
![Status](https://img.shields.io/badge/status-deployed-brightgreen)
![Solidity](https://img.shields.io/badge/solidity-^0.8.20-363636)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

A simple ERC-20 token deployed on Circle's **Arc Testnet** — a stablecoin-native Layer-1 blockchain using USDC as gas. Includes a Hardhat project structure with deploy scripts, unit tests, and a Python monitoring tool for tracking wallet USDC balance in real time.

## Contract Details

| Field | Value |
|---|---|
| Contract Address | [`0x2D30Fe563d780Be98422044733FeFFD8F0FC245C`](https://testnet.arcscan.app/address/0x2D30Fe563d780Be98422044733FeFFD8F0FC245C) |
| Deploy Tx | [`0xb25a9f02...d5240`](https://testnet.arcscan.app/tx/0xb25a9f02b57cda4fc64b5e7306f8d7a4f704e13b66260c81e79e87e4806d5240) |
| Token Name | MyToken (MTK) |
| Network | Arc Testnet |
| Chain ID | 5042002 |
| RPC URL | https://rpc.testnet.arc.network |
| Explorer | [View on Arcscan](https://testnet.arcscan.app/address/0x2D30Fe563d780Be98422044733FeFFD8F0FC245C) |

## Project Structure

```
arc-testnet-token/
├── contracts/
│   └── MyToken.sol        # ERC-20 token contract
├── scripts/
│   └── deploy.js          # Hardhat deploy script
├── test/
│   └── MyToken.test.js    # Unit tests (Hardhat + Chai)
├── tools/
│   └── monitor.py         # Python balance monitor
├── hardhat.config.js
├── package.json
└── .gitignore
```

## Tech Stack

- **Solidity** ^0.8.20 + OpenZeppelin Contracts (ERC20, Ownable)
- **Hardhat** ^2.22 — compile, test, deploy
- Deployed via **Remix IDE** + MetaMask (Injected Provider) on Arc Testnet
- **Python** 3.x + web3.py for balance monitoring

## Quick Start

```bash
npm install
npx hardhat test
```

To deploy to Arc Testnet:
```bash
cp .env.example .env   # add your PRIVATE_KEY
npx hardhat run scripts/deploy.js --network arc_testnet
```

## Run the Balance Monitor

```bash
pip install web3
python tools/monitor.py
```

Polls Arc Testnet RPC every 60 seconds and logs USDC balance to `balance_log.csv`.

## Next Steps

- Add `burn()` function to allow token destruction by holder
- Add `pause/unpause` using OpenZeppelin `Pausable`
- Extend `monitor.py` with Telegram bot notifications on balance changes

## License

MIT
