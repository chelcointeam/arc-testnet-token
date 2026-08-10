# ArcToken — Payment-Flow Testing on Arc Testnet

![Arc Testnet](https://img.shields.io/badge/network-Arc%20Testnet-blue)
![Solidity](https://img.shields.io/badge/solidity-^0.8.20-363636)
![Status](https://img.shields.io/badge/status-active-brightgreen)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

An ERC-20 token purpose-built for **end-to-end payment-flow testing** on Circle's [Arc Testnet](https://testnet.arcscan.app) — a stablecoin-native Layer-1 that uses USDC as gas. `ArcToken` adds `pause` (circuit-breaker) and `burn` (settlement / void) on top of standard `mint`+`transfer`, giving you a complete lifecycle to drive integration tests against.

## Contract Details

| Field | Value |
|---|---|
| Contract Address | [`0x2D30Fe563d780Be98422044733FeFFD8F0FC245C`](https://testnet.arcscan.app/address/0x2D30Fe563d780Be98422044733FeFFD8F0FC245C) |
| Token Name / Symbol | ArcToken / ARC |
| Network | Arc Testnet |
| Chain ID | 5042002 |
| RPC URL | `https://rpc.testnet.arc.network` |
| Explorer | [testnet.arcscan.app](https://testnet.arcscan.app/address/0x2D30Fe563d780Be98422044733FeFFD8F0FC245C) |

## Payment Flow

The canonical test cycle implemented by this repo:

```
owner.mint(customer, N)
  └─▶ customer.transfer(merchant, N)     ← payment
        └─▶ merchant.burn(N)             ← settlement / void
```

The `pause()` / `unpause()` circuit-breaker can be injected at any step to verify your application handles `EnforcedPause` reverts correctly.

## Contract Features

| Feature | Method | Who |
|---|---|---|
| Mint tokens | `mint(to, amount)` | Owner only |
| Transfer | `transfer(to, amount)` | Any holder |
| Burn own tokens | `burn(amount)` | Any holder |
| Burn with allowance | `burnFrom(from, amount)` | Approved spender |
| Pause all transfers | `pause()` | Owner only |
| Resume transfers | `unpause()` | Owner only |

## Project Structure

```
arc-testnet-token/
├── contracts/
│   └── ArcToken.sol              # Pausable + Burnable ERC-20
├── scripts/
│   ├── deploy.js                 # Deploy to Arc Testnet
│   ├── pause.js                  # Pause / unpause deployed contract
│   └── simulate-payment.js      # Full mint→transfer→burn simulation
├── test/
│   └── ArcToken.test.js          # Hardhat/Chai test suite
├── tools/
│   └── monitor.py                # Python USDC balance monitor
├── hardhat.config.js
├── package.json
└── .env.example
```

## Quick Start

```bash
npm install
npx hardhat test          # run full test suite locally
```

## Deploy

```bash
cp .env.example .env      # paste your PRIVATE_KEY
npx hardhat run scripts/deploy.js --network arc_testnet
```

## Pause / Unpause

```bash
# Pause
TOKEN_ADDRESS=0x... npx hardhat run scripts/pause.js --network arc_testnet

# Unpause
UNPAUSE=1 TOKEN_ADDRESS=0x... npx hardhat run scripts/pause.js --network arc_testnet
```

## Run Payment Simulation

```bash
# Basic flow: mint → transfer → burn
TOKEN_ADDRESS=0x... npx hardhat run scripts/simulate-payment.js --network arc_testnet

# With circuit-breaker: pause injected between mint and transfer
PAUSE_BETWEEN=1 TOKEN_ADDRESS=0x... npx hardhat run scripts/simulate-payment.js --network arc_testnet
```

The simulation logs each step with the transaction hash so you can verify on [Arcscan](https://testnet.arcscan.app).

## Balance Monitor

```bash
pip install web3
python tools/monitor.py
```

Polls the Arc Testnet RPC every 60 s and appends USDC balance to `balance_log.csv`.

## Tech Stack

- **Solidity** ^0.8.20 + OpenZeppelin (ERC20, ERC20Burnable, ERC20Pausable, Ownable)
- **Hardhat** ^2.22 — compile / test / deploy
- **Python** 3.x + web3.py — balance monitoring

## License

MIT
