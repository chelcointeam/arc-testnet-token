// Deploy PayToken to Arc Testnet
// Usage: npx hardhat run scripts/deploy.js --network arc_testnet

const fs = require("fs");
const path = require("path");
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

  const receipt = await token.deploymentTransaction().wait();
  const blockNumber = receipt.blockNumber;
  const timestamp = new Date().toISOString();
  const deployerAddress = deployer.address;

  let network = await ethers.provider.getNetwork();
  const networkName = network.name && network.name !== "unknown"
    ? network.name
    : String(network.chainId);

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  fs.mkdirSync(deploymentsDir, { recursive: true });

  const filePath = path.join(deploymentsDir, `${networkName}.json`);
  fs.writeFileSync(
    filePath,
    JSON.stringify(
      { address, blockNumber, timestamp, deployer: deployerAddress },
      null,
      2
    ) + "\n"
  );

  console.log("deployment record:", filePath);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
