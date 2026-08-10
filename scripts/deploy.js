// Deploy ArcToken to Arc Testnet
// Usage: npx hardhat run scripts/deploy.js --network arc_testnet

const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account USDC balance (wei):", balance.toString());

  const initialSupply = 1_000_000; // 1 000 000 ARC
  const ArcToken = await ethers.getContractFactory("ArcToken");
  const token = await ArcToken.deploy(initialSupply);
  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log("ArcToken deployed to:", address);
  console.log("Initial supply:       ", initialSupply, "ARC");
  console.log("Explorer:", `https://testnet.arcscan.app/address/${address}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
