// Pause / unpause PayToken on Arc Testnet
// Usage:
//   TOKEN_ADDRESS=0x... npx hardhat run scripts/pause.js --network arc_testnet
//   UNPAUSE=1 TOKEN_ADDRESS=0x... npx hardhat run scripts/pause.js --network arc_testnet

const { ethers } = require("hardhat");

const CONTRACT_ADDRESS = process.env.TOKEN_ADDRESS;

async function main() {
  if (!CONTRACT_ADDRESS) {
    throw new Error("TOKEN_ADDRESS is not set");
  }

  const [owner] = await ethers.getSigners();
  const PayToken = await ethers.getContractFactory("PayToken");
  const token = PayToken.attach(CONTRACT_ADDRESS);

  const shouldUnpause = process.env.UNPAUSE === "1";
  const currentlyPaused = await token.paused();

  if (shouldUnpause) {
    if (!currentlyPaused) {
      console.log("already unpaused");
      return;
    }
    const tx = await token.connect(owner).unpause();
    await tx.wait();
    console.log("unpaused, tx:", tx.hash);
  } else {
    if (currentlyPaused) {
      console.log("already paused");
      return;
    }
    const tx = await token.connect(owner).pause();
    await tx.wait();
    console.log("paused, tx:", tx.hash);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
