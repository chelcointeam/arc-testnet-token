# PayToken

ERC-20 token used to test settlement mechanics on Arc Testnet before wiring
them into a payment backend. Adds mint, burn and pause on top of a standard
OpenZeppelin token so a merchant integration can be tested without touching
mainnet infra.

## Contract

- `contracts/PayToken.sol` — ERC20 + ERC20Burnable + ERC20Pausable
- owner can mint and pause/unpause
- any holder can burn their own balance or approve burnFrom

## Setup

```
npm install
cp .env.example .env
```

## Test

```
npx hardhat test
```

## Deploy

```
npx hardhat run scripts/deploy.js --network arc_testnet
```

## Pause / unpause

```
TOKEN_ADDRESS=0x... npx hardhat run scripts/pause.js --network arc_testnet
UNPAUSE=1 TOKEN_ADDRESS=0x... npx hardhat run scripts/pause.js --network arc_testnet
```

## Simulate a transfer + settlement cycle

```
TOKEN_ADDRESS=0x... npx hardhat run scripts/simulate-payment.js --network arc_testnet
PAUSE_BETWEEN=1 TOKEN_ADDRESS=0x... npx hardhat run scripts/simulate-payment.js --network arc_testnet
```

Notes: pause is meant as a manual kill switch if something looks wrong
mid-integration, not a governance feature.

## Monitoring

`tools/balance-watch.js` polls PayToken balances for configured addresses and the contract pause state at a fixed interval. It writes only state changes, which helps a merchant detect transfers that may be blocked or stalled while the token is paused.
