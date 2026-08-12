// Simulate a payment cycle on Arc Testnet:
//   1. owner mints to customer
//   2. customer transfers to merchant
//
// Usage:
//   TOKEN_ADDRESS=0x... npx hardhat run scripts/simulate-payment.js --network arc_testnet

const { ethers } = require("hardhat");

const CONTRACT_ADDRESS = process.env.TOKEN_ADDRESS;
const PAYMENT_AMOUNT   = 100;

async function main() {
  if (!CONTRACT_ADDRESS) {
    throw new Error("TOKEN_ADDRESS is not set");
  }

  const [owner, merchant, customer] = await ethers.getSigners();
  const MyToken = await ethers.getContractFactory("MyToken");
  const token = MyToken.attach(CONTRACT_ADDRESS);
  const amt = BigInt(PAYMENT_AMOUNT) * BigInt(10 ** 18);

  console.log("owner:   ", owner.address);
  console.log("merchant:", merchant.address);
  console.log("customer:", customer.address);

  console.log(`\n[1] minting ${PAYMENT_AMOUNT} MTK to customer`);
  let tx = await token.connect(owner).mint(customer.address, PAYMENT_AMOUNT);
  await tx.wait();
  console.log("    tx:", tx.hash);
  console.log("    customer balance:", ethers.formatUnits(await token.balanceOf(customer.address), 18), "MTK");

  console.log(`\n[2] customer transfers ${PAYMENT_AMOUNT} MTK to merchant`);
  tx = await token.connect(customer).transfer(merchant.address, amt);
  await tx.wait();
  console.log("    tx:", tx.hash);
  console.log("    merchant balance:", ethers.formatUnits(await token.balanceOf(merchant.address), 18), "MTK");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
