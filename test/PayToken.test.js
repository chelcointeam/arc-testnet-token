const { expect } = require("chai");
const { ethers } = require("hardhat");

const INITIAL_SUPPLY = 1_000_000;

let token, owner, user, other;

beforeEach(async function () {
  [owner, user, other] = await ethers.getSigners();
  const Factory = await ethers.getContractFactory("PayToken");
  token = await Factory.deploy(INITIAL_SUPPLY);
  await token.waitForDeployment();
});

it("sets name and symbol", async function () {
  expect(await token.name()).to.equal("PayToken");
  expect(await token.symbol()).to.equal("PAY");
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

it("holder can burn own balance", async function () {
  await token.mint(user.address, 200);
  const burnAmt = BigInt(100) * BigInt(10 ** 18);
  await token.connect(user).burn(burnAmt);
  const remaining = BigInt(100) * BigInt(10 ** 18);
  expect(await token.balanceOf(user.address)).to.equal(remaining);
});

it("burnFrom works with allowance", async function () {
  await token.mint(user.address, 100);
  const burnAmt = BigInt(50) * BigInt(10 ** 18);
  await token.connect(user).approve(other.address, burnAmt);
  await token.connect(other).burnFrom(user.address, burnAmt);
  expect(await token.balanceOf(user.address)).to.equal(BigInt(50) * BigInt(10 ** 18));
});

it("burnFrom fails without allowance", async function () {
  await token.mint(user.address, 100);
  const burnAmt = BigInt(50) * BigInt(10 ** 18);
  await expect(
    token.connect(other).burnFrom(user.address, burnAmt)
  ).to.be.revertedWithCustomError(token, "ERC20InsufficientAllowance");
});

it("owner can pause and unpause", async function () {
  await token.pause();
  expect(await token.paused()).to.equal(true);
  await token.unpause();
  expect(await token.paused()).to.equal(false);
});

it("non-owner cannot pause", async function () {
  await expect(
    token.connect(user).pause()
  ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
});

it("transfer fails while paused", async function () {
  await token.mint(user.address, 100);
  await token.pause();
  const amt = BigInt(10) * BigInt(10 ** 18);
  await expect(
    token.connect(user).transfer(other.address, amt)
  ).to.be.revertedWithCustomError(token, "EnforcedPause");
});

it("transfer works again after unpause", async function () {
  await token.mint(user.address, 100);
  await token.pause();
  await token.unpause();
  const amt = BigInt(10) * BigInt(10 ** 18);
  await expect(
    token.connect(user).transfer(other.address, amt)
  ).to.not.be.reverted;
});
