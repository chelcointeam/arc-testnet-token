// Deploy MyToken to Arc Testnet using Hardhat + ethers.js
// Usage: npx hardhat run scripts/deploy.js --network arc_testnet

const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance (USDC wei):", balance.toString());

  const initialSupply = 1_000_000; // 1,000,000 MTK
  const MyToken = await ethers.getContractFactory("MyToken");
  const token = await MyToken.deploy(initialSupply);
  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log("MyToken deployed to:", address);
  console.log("Initial supply:", initialSupply, "MTK");
  console.log("Explorer:", `https://testnet.arcscan.app/address/${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
