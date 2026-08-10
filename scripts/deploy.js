// Deploy PayToken to Arc Testnet
// Usage: npx hardhat run scripts/deploy.js --network arc_testnet

const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("deployer:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("balance (wei):", balance.toString());

  const initialSupply = 1_000_000;
  const PayToken = await ethers.getContractFactory("PayToken");
  const token = await PayToken.deploy(initialSupply);
  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log("PayToken deployed to:", address);
  console.log("initial supply:", initialSupply, "PAY");
  console.log("explorer:", `https://testnet.arcscan.app/address/${address}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
