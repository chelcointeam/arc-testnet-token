from web3 import Web3
import time, csv

RPC_URL = "https://rpc.testnet.arc.network"
WALLET = "0x60b73717cF711F312A621F19bd76Ac138DA5af76"
w3 = Web3(Web3.HTTPProvider(RPC_URL))

def check_balance():
    balance = w3.eth.get_balance(WALLET)
    return w3.from_wei(balance, "ether")

def log_balance():
    bal = check_balance()
    ts = time.strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{ts}] Balance: {bal} USDC")
    with open("balance_log.csv", "a", newline="") as f:
        writer = csv.writer(f)
        writer.writerow([ts, bal])

print("Monitor started. Press Ctrl+C to stop.")
while True:
    log_balance()
    time.sleep(60)