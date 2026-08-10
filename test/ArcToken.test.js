// ArcToken — full payment-flow test suite
// Run: npx hardhat test

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ArcToken", function () {
  let token;
  let owner, merchant, customer, other;
  const INITIAL_SUPPLY = 1_000_000;

  beforeEach(async function () {
    [owner, merchant, customer, other] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("ArcToken");
    token = await Factory.deploy(INITIAL_SUPPLY);
    await token.waitForDeployment();
  });

  // ─── Deployment ────────────────────────────────────────────────────────────
  describe("Deployment", function () {
    it("has correct name and symbol", async function () {
      expect(await token.name()).to.equal("ArcToken");
      expect(await token.symbol()).to.equal("ARC");
    });

    it("mints initial supply to deployer", async function () {
      const expected = BigInt(INITIAL_SUPPLY) * BigInt(10 ** 18);
      expect(await token.balanceOf(owner.address)).to.equal(expected);
    });

    it("starts unpaused", async function () {
      expect(await token.paused()).to.equal(false);
    });
  });

  // ─── Minting ───────────────────────────────────────────────────────────────
  describe("Minting", function () {
    it("owner can mint to merchant wallet", async function () {
      await token.mint(merchant.address, 10_000);
      const expected = BigInt(10_000) * BigInt(10 ** 18);
      expect(await token.balanceOf(merchant.address)).to.equal(expected);
    });

    it("reverts when non-owner mints", async function () {
      await expect(
        token.connect(customer).mint(customer.address, 100)
      ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
    });
  });

  // ─── Payment Flow ──────────────────────────────────────────────────────────
  describe("Payment flow", function () {
    beforeEach(async function () {
      // Seed customer with 1 000 tokens to spend
      await token.mint(customer.address, 1_000);
    });

    it("customer pays merchant (transfer)", async function () {
      const amount = BigInt(100) * BigInt(10 ** 18);
      await token.connect(customer).transfer(merchant.address, amount);
      expect(await token.balanceOf(merchant.address)).to.equal(amount);
    });

    it("merchant burns received tokens (settlement)", async function () {
      const amount = BigInt(100) * BigInt(10 ** 18);
      await token.connect(customer).transfer(merchant.address, amount);
      await token.connect(merchant).burn(amount);
      expect(await token.balanceOf(merchant.address)).to.equal(0n);
    });

    it("customer can burn own tokens (refund/void)", async function () {
      const before = await token.balanceOf(customer.address);
      const burnAmt = BigInt(200) * BigInt(10 ** 18);
      await token.connect(customer).burn(burnAmt);
      expect(await token.balanceOf(customer.address)).to.equal(before - burnAmt);
    });

    it("burnFrom requires allowance", async function () {
      const burnAmt = BigInt(50) * BigInt(10 ** 18);
      // approve then burnFrom
      await token.connect(customer).approve(merchant.address, burnAmt);
      await token.connect(merchant).burnFrom(customer.address, burnAmt);
      const remaining = (BigInt(1_000) - BigInt(50)) * BigInt(10 ** 18);
      expect(await token.balanceOf(customer.address)).to.equal(remaining);
    });

    it("burnFrom reverts without allowance", async function () {
      const burnAmt = BigInt(50) * BigInt(10 ** 18);
      await expect(
        token.connect(merchant).burnFrom(customer.address, burnAmt)
      ).to.be.revertedWithCustomError(token, "ERC20InsufficientAllowance");
    });
  });

  // ─── Pause / Circuit-breaker ───────────────────────────────────────────────
  describe("Pause (circuit-breaker)", function () {
    it("owner can pause", async function () {
      await token.pause();
      expect(await token.paused()).to.equal(true);
    });

    it("owner can unpause", async function () {
      await token.pause();
      await token.unpause();
      expect(await token.paused()).to.equal(false);
    });

    it("non-owner cannot pause", async function () {
      await expect(
        token.connect(other).pause()
      ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
    });

    it("transfer reverts while paused", async function () {
      await token.mint(customer.address, 100);
      await token.pause();
      const amt = BigInt(10) * BigInt(10 ** 18);
      await expect(
        token.connect(customer).transfer(merchant.address, amt)
      ).to.be.revertedWithCustomError(token, "EnforcedPause");
    });

    it("transfers work again after unpause", async function () {
      await token.mint(customer.address, 100);
      await token.pause();
      await token.unpause();
      const amt = BigInt(10) * BigInt(10 ** 18);
      await expect(
        token.connect(customer).transfer(merchant.address, amt)
      ).to.not.be.reverted;
    });

    it("emits ContractPaused / ContractUnpaused events", async function () {
      await expect(token.pause())
        .to.emit(token, "ContractPaused")
        .withArgs(owner.address);
      await expect(token.unpause())
        .to.emit(token, "ContractUnpaused")
        .withArgs(owner.address);
    });
  });
});
