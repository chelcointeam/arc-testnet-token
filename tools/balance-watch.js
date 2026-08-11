// Watch PayToken balances and pause state on Arc Testnet.
// Usage: node tools/balance-watch.js
// Env: RPC_URL, PAYTOKEN_ADDRESS, WATCH_ADDRESSES (comma-separated),
//      BALANCE_WATCH_INTERVAL_MS (default 30000), BALANCE_WATCH_LOG_FILE (optional)

const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");

const RPC_URL = process.env.RPC_URL;
const PAYTOKEN_ADDRESS = process.env.PAYTOKEN_ADDRESS;
const WATCH_ADDRESSES = (process.env.WATCH_ADDRESSES || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const INTERVAL_MS = Number(process.env.BALANCE_WATCH_INTERVAL_MS) || 30000;
const LOG_FILE = process.env.BALANCE_WATCH_LOG_FILE;

const ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function paused() view returns (bool)",
];

let lastState = "";
let lastError = "";

function writeLine(line) {
  console.log(line);
  if (LOG_FILE) {
    fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
    fs.appendFileSync(LOG_FILE, line + "\n");
  }
}

async function poll(token, addresses) {
  const paused = await token.paused();
  const balances = {};
  for (const addr of addresses) {
    balances[addr] = (await token.balanceOf(addr)).toString();
  }
  const state = JSON.stringify({ paused, balances });
  if (state !== lastState) {
    const ts = new Date().toISOString();
    const parts = addresses.map(
      (a) => `${a} ${balances[a]}`
    );
    writeLine(`[${ts}] paused=${paused} ${parts.join(" | ")}`);
    lastState = state;
  }
}

async function tick(token, addresses) {
  try {
    await poll(token, addresses);
    lastError = "";
  } catch (err) {
    const msg = err && err.message ? err.message : String(err);
    if (msg !== lastError) {
      writeLine(`[${new Date().toISOString()}] error: ${msg}`);
      lastError = msg;
    }
  }
}

async function main() {
  if (!RPC_URL || !PAYTOKEN_ADDRESS || WATCH_ADDRESSES.length === 0) {
    console.error(
      "RPC_URL, PAYTOKEN_ADDRESS and WATCH_ADDRESSES are required"
    );
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const token = new ethers.Contract(PAYTOKEN_ADDRESS, ABI, provider);

  await tick(token, WATCH_ADDRESSES);
  setInterval(() => tick(token, WATCH_ADDRESSES), INTERVAL_MS);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
