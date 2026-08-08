// Unit tests for MyToken contract
// Run with: npx hardhat test

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken", function () {
  let token;
  let owner;
  let user;
  const initialSupply = 1_000_000;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    const MyToken = await ethers.getContractFactory("MyToken");
    token = await MyToken.deploy(initialSupply);
    await token.waitForDeployment();
  });

  it("Should set correct token name and symbol", async function () {
    expect(await token.name()).to.equal("MyToken");
    expect(await token.symbol()).to.equal("MTK");
  });

  it("Should mint initial supply to deployer", async function () {
    const ownerBalance = await token.balanceOf(owner.address);
    const expected = BigInt(initialSupply) * BigInt(10 ** 18);
    expect(ownerBalance).to.equal(expected);
  });

  it("Should allow owner to mint new tokens", async function () {
    await token.mint(user.address, 500);
    const userBalance = await token.balanceOf(user.address);
    const expected = BigInt(500) * BigInt(10 ** 18);
    expect(userBalance).to.equal(expected);
  });

  it("Should revert if non-owner tries to mint", async function () {
    await expect(
      token.connect(user).mint(user.address, 100)
    ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
  });

  it("Should have 18 decimals", async function () {
    expect(await token.decimals()).to.equal(18);
  });
});
