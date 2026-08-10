// Simulate a payment cycle on Arc Testnet:
//   1. owner mints to customer
//   2. customer transfers to merchant
//   3. merchant burns (settlement)
//
// Usage:
//   TOKEN_ADDRESS=0x... npx hardhat run scripts/simulate-payment.js --network arc_testnet
//   PAUSE_BETWEEN=1 TOKEN_ADDRESS=0x... npx hardhat run scripts/simulate-payment.js --network arc_testnet

const { ethers } = require("hardhat");

const CONTRACT_ADDRESS = process.env.TOKEN_ADDRESS;
const PAUSE_BETWEEN    = process.env.PAUSE_BETWEEN === "1";
const PAYMENT_AMOUNT   = 100;

async function main() {
  if (!CONTRACT_ADDRESS) {
    throw new Error("TOKEN_ADDRESS is not set");
  }

  const [owner, merchant, customer] = await ethers.getSigners();
  const PayToken = await ethers.getContractFactory("PayToken");
  const token = PayToken.attach(CONTRACT_ADDRESS);
  const amt = BigInt(PAYMENT_AMOUNT) * BigInt(10 ** 18);

  console.log("owner:   ", owner.address);
  console.log("merchant:", merchant.address);
  console.log("customer:", customer.address);

  console.log(`\n[1] minting ${PAYMENT_AMOUNT} PAY to customer`);
  let tx = await token.connect(owner).mint(customer.address, PAYMENT_AMOUNT);
  await tx.wait();
  console.log("    tx:", tx.hash);
  console.log("    customer balance:", ethers.formatUnits(await token.balanceOf(customer.address), 18), "PAY");

  if (PAUSE_BETWEEN) {
    console.log("\n[pause] pausing contract");
    tx = await token.connect(owner).pause();
    await tx.wait();
    console.log("    tx:", tx.hash);
    console.log("    attempting transfer (expect revert)");
    try {
      await token.connect(customer).transfer(merchant.address, amt);
      console.log("    transfer succeeded — unexpected");
    } catch (e) {
      console.log("    transfer blocked:", e.message.split("(")[0].trim());
    }
    tx = await token.connect(owner).unpause();
    await tx.wait();
    console.log("    unpaused, tx:", tx.hash);
  }

  console.log(`\n[2] customer transfers ${PAYMENT_AMOUNT} PAY to merchant`);
  tx = await token.connect(customer).transfer(merchant.address, amt);
  await tx.wait();
  console.log("    tx:", tx.hash);
  console.log("    merchant balance:", ethers.formatUnits(await token.balanceOf(merchant.address), 18), "PAY");

  console.log(`\n[3] merchant burns ${PAYMENT_AMOUNT} PAY`);
  tx = await token.connect(merchant).burn(amt);
  await tx.wait();
  console.log("    tx:", tx.hash);
  console.log("    merchant balance after burn:", ethers.formatUnits(await token.balanceOf(merchant.address), 18), "PAY");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
