const { expect } = require("chai");
const { ethers } = require("hardhat");

const INITIAL_SUPPLY = 1_000_000;

let token, owner, user, other;

beforeEach(async function () {
  [owner, user, other] = await ethers.getSigners();
  const Factory = await ethers.getContractFactory("MyToken");
  token = await Factory.deploy(INITIAL_SUPPLY);
  await token.waitForDeployment();
});

it("sets name and symbol", async function () {
  expect(await token.name()).to.equal("MyToken");
  expect(await token.symbol()).to.equal("MTK");
});

it("mints initial supply to owner", async function () {
  const expected = BigInt(INITIAL_SUPPLY) * BigInt(10 ** 18);
  expect(await token.balanceOf(owner.address)).to.equal(expected);
});

it("owner can mint", async function () {
  await token.mint(user.address, 500);
  const expected = BigInt(500) * BigInt(10 ** 18);
  expect(await token.balanceOf(user.address)).to.equal(expected);
});

it("non-owner cannot mint", async function () {
  await expect(
    token.connect(user).mint(user.address, 100)
  ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
});

it("transfers tokens between accounts", async function () {
  await token.mint(user.address, 100);
  const amt = BigInt(50) * BigInt(10 ** 18);
  await token.connect(user).transfer(other.address, amt);
  expect(await token.balanceOf(other.address)).to.equal(amt);
});

it("transfer from works with allowance", async function () {
  await token.mint(user.address, 100);
  const amt = BigInt(50) * BigInt(10 ** 18);
  await token.connect(user).approve(other.address, amt);
  await token.connect(other).transferFrom(user.address, other.address, amt);
  expect(await token.balanceOf(other.address)).to.equal(amt);
});

it("owner can transfer ownership", async function () {
  await token.transferOwnership(user.address);
  expect(await token.owner()).to.equal(user.address);
});
