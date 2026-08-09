"""
Arc Testnet Balance Monitor
Tracks wallet USDC balance on Arc Testnet every 60 seconds.
Logs results to balance_log.csv.

Requirements:
    pip install web3

Usage:
    python tools/monitor.py
"""

from web3 import Web3
import time
import csv

# Arc Testnet RPC endpoint
RPC_URL = "https://rpc.testnet.arc.network"

# Wallet address to monitor (public address only, no private key needed)
WALLET = "0x60b73717cF711F312A621F19bd76Ac138DA5af76"

# Output CSV file
LOG_FILE = "balance_log.csv"

# Polling interval in seconds
INTERVAL = 60

# Connect to Arc Testnet
w3 = Web3(Web3.HTTPProvider(RPC_URL))


def check_balance() -> float:
    """Fetch current wallet balance from Arc Testnet RPC."""
    if not w3.is_connected():
        raise ConnectionError(f"Cannot connect to RPC: {RPC_URL}")
    balance = w3.eth.get_balance(WALLET)
    return float(w3.from_wei(balance, "ether"))


def log_balance() -> None:
    """Check balance, print to console and append to CSV log."""
    try:
        bal = check_balance()
        ts = time.strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{ts}] Balance: {bal} USDC")
        with open(LOG_FILE, "a", newline="") as f:
            writer = csv.writer(f)
            writer.writerow([ts, bal])
    except Exception as e:
        print(f"[ERROR] {e}")


if __name__ == "__main__":
    print(f"Arc Testnet Monitor started. Wallet: {WALLET}")
    print(f"Polling every {INTERVAL}s. Press Ctrl+C to stop.")
    while True:
        log_balance()
        time.sleep(INTERVAL)
