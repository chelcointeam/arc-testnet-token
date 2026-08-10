// Simulate a complete payment-flow cycle on Arc Testnet:
//   1. Owner mints tokens to customer
//   2. Customer transfers to merchant
//   3. Merchant burns tokens (settlement)
//
// Usage:
//   TOKEN_ADDRESS=0x... npx hardhat run scripts/simulate-payment.js --network arc_testnet
//
// Optionally test circuit-breaker:
//   PAUSE_BETWEEN=1 TOKEN_ADDRESS=0x... npx hardhat run scripts/simulate-payment.js --network arc_testnet

const { ethers } = require("hardhat");

const CONTRACT_ADDRESS = process.env.TOKEN_ADDRESS;
const PAUSE_BETWEEN    = process.env.PAUSE_BETWEEN === "1";
const PAYMENT_AMOUNT   = 100; // ARC tokens (human-readable)

async function main() {
  if (!CONTRACT_ADDRESS) {
    throw new Error("Set TOKEN_ADDRESS env var");
  }

  const [owner, merchant, customer] = await ethers.getSigners();
  const ArcToken = await ethers.getContractFactory("ArcToken");
  const token = ArcToken.attach(CONTRACT_ADDRESS);
  const amt = BigInt(PAYMENT_AMOUNT) * BigInt(10 ** 18);

  console.log("=== ArcToken Payment Flow Simulation ===");
  console.log("Owner:   ", owner.address);
  console.log("Merchant:", merchant.address);
  console.log("Customer:", customer.address);

  // Step 1 — Mint to customer
  console.log(`\n[1] Minting ${PAYMENT_AMOUNT} ARC to customer…`);
  let tx = await token.connect(owner).mint(customer.address, PAYMENT_AMOUNT);
  await tx.wait();
  console.log("    Tx:", tx.hash);
  console.log("    Customer balance:", ethers.formatUnits(await token.balanceOf(customer.address), 18), "ARC");

  // Optional circuit-breaker test
  if (PAUSE_BETWEEN) {
    console.log("\n[!] PAUSE_BETWEEN=1 — pausing contract…");
    tx = await token.connect(owner).pause();
    await tx.wait();
    console.log("    Contract paused. Tx:", tx.hash);
    console.log("    Attempting transfer (should fail)…");
    try {
      await token.connect(customer).transfer(merchant.address, amt);
      console.log("    ❌ Transfer succeeded — unexpected!");
    } catch (e) {
      console.log("    ✅ Transfer blocked as expected:", e.message.split("(")[0].trim());
    }
    console.log("    Unpausing…");
    tx = await token.connect(owner).unpause();
    await tx.wait();
    console.log("    Contract unpaused. Tx:", tx.hash);
  }

  // Step 2 — Customer pays merchant
  console.log(`\n[2] Customer transfers ${PAYMENT_AMOUNT} ARC to merchant…`);
  tx = await token.connect(customer).transfer(merchant.address, amt);
  await tx.wait();
  console.log("    Tx:", tx.hash);
  console.log("    Merchant balance:", ethers.formatUnits(await token.balanceOf(merchant.address), 18), "ARC");

  // Step 3 — Merchant burns (settlement)
  console.log(`\n[3] Merchant burns ${PAYMENT_AMOUNT} ARC (settlement)…`);
  tx = await token.connect(merchant).burn(amt);
  await tx.wait();
  console.log("    Tx:", tx.hash);
  console.log("    Merchant balance after burn:", ethers.formatUnits(await token.balanceOf(merchant.address), 18), "ARC");

  console.log("\n=== Simulation complete ===");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
