# MyToken

ERC-20 token deployed on Arc Testnet to test settlement mechanics before
wiring them into a payment backend. Uses OpenZeppelin's audited ERC20 and
Ownable, so the contract is a standard, verifiable deployment on Arc.

## Contract

- `contracts/MyToken.sol` — ERC20 + Ownable, only owner can mint

## Deployed on Arc Testnet

- Contract: [0x2D30Fe563d780Be98422044733FeFFD8F0FC245C](https://testnet.arcscan.app/address/0x2D30Fe563d780Be98422044733FeFFD8F0FC245C)
- Verified: yes
- Deploy tx: [0xb25a9f02b57cda4fc64b5e7306f8d7a4f704e13b66260c81e79e87e4806d5240](https://testnet.arcscan.app/tx/0xb25a9f02b57cda4fc64b5e7306f8d7a4f704e13b66260c81e79e87e4806d5240)
- Deployer: `0x60b73717cF711F312A621F19bd76Ac138DA5af76`

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

## Simulate a transfer cycle

```
TOKEN_ADDRESS=0x... npx hardhat run scripts/simulate-payment.js --network arc_testnet
```

## Monitoring

`tools/balance-watch.js` polls MyToken balances for configured addresses at a fixed interval. It writes only state changes, which helps a merchant detect transfers that may be blocked or stalled.
