// Generate on-chain activity for MyToken on Arc Testnet:
//   1. owner mints MTK to TARGET_ADDRESS
//   2. owner transfers MTK to TARGET_ADDRESS
//
// Usage:
//   TOKEN_ADDRESS=0x... TARGET_ADDRESS=0x... npx hardhat run scripts/activity.js --network arc_testnet

const { ethers } = require("hardhat");

const CONTRACT_ADDRESS = process.env.TOKEN_ADDRESS;
const TARGET_ADDRESS = process.env.TARGET_ADDRESS;
const MINT_AMOUNT = process.env.MINT_AMOUNT || "50";
const TRANSFER_AMOUNT = process.env.TRANSFER_AMOUNT || "25";

async function main() {
  if (!CONTRACT_ADDRESS || !TARGET_ADDRESS) {
    throw new Error("TOKEN_ADDRESS and TARGET_ADDRESS are required");
  }

  const [owner] = await ethers.getSigners();
  const MyToken = await ethers.getContractFactory("MyToken");
  const token = MyToken.attach(CONTRACT_ADDRESS);

  console.log("owner:  ", owner.address);
  console.log("target: ", TARGET_ADDRESS);
  console.log("token:  ", CONTRACT_ADDRESS);

  console.log(`\n[1] minting ${MINT_AMOUNT} MTK to ${TARGET_ADDRESS}`);
  let tx = await token.connect(owner).mint(TARGET_ADDRESS, MINT_AMOUNT);
  await tx.wait();
  console.log("    tx:", tx.hash);
  console.log("    explorer:", `https://testnet.arcscan.app/tx/${tx.hash}`);

  console.log(`\n[2] transferring ${TRANSFER_AMOUNT} MTK to ${TARGET_ADDRESS}`);
  const amt = BigInt(TRANSFER_AMOUNT) * BigInt(10 ** 18);
  tx = await token.connect(owner).transfer(TARGET_ADDRESS, amt);
  await tx.wait();
  console.log("    tx:", tx.hash);
  console.log("    explorer:", `https://testnet.arcscan.app/tx/${tx.hash}`);

  console.log("\ntarget balance:", ethers.formatUnits(await token.balanceOf(TARGET_ADDRESS), 18), "MTK");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
