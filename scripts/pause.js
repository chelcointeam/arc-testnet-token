// Pause / unpause ArcToken on Arc Testnet
// Usage:
//   npx hardhat run scripts/pause.js --network arc_testnet          # pause
//   UNPAUSE=1 npx hardhat run scripts/pause.js --network arc_testnet # unpause

const { ethers } = require("hardhat");

const CONTRACT_ADDRESS = process.env.TOKEN_ADDRESS;

async function main() {
  if (!CONTRACT_ADDRESS) {
    throw new Error("Set TOKEN_ADDRESS env var to the deployed contract address");
  }

  const [owner] = await ethers.getSigners();
  const ArcToken = await ethers.getContractFactory("ArcToken");
  const token = ArcToken.attach(CONTRACT_ADDRESS);

  const shouldUnpause = process.env.UNPAUSE === "1";
  const currentlyPaused = await token.paused();

  if (shouldUnpause) {
    if (!currentlyPaused) {
      console.log("Contract is already unpaused — nothing to do.");
      return;
    }
    const tx = await token.connect(owner).unpause();
    await tx.wait();
    console.log("✅  Contract unpaused. Tx:", tx.hash);
  } else {
    if (currentlyPaused) {
      console.log("Contract is already paused — nothing to do.");
      return;
    }
    const tx = await token.connect(owner).pause();
    await tx.wait();
    console.log("⏸️   Contract paused. Tx:", tx.hash);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
