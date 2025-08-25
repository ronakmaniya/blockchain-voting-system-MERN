# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```

# 1. Connect Hardhat to Ganache

Inside blockchain/.env:

```shell
# Blockchain network info
GANACHE_URL=http://127.0.0.1:7545
GANACHE_CHAIN_ID=1337

# Paste a Admin private key (Ganache Account #1) – used only for deployment/admin tasks. KEEP the 0x prefix.
GANACHE_PRIVATE_KEY=0xYOUR_GANACHE_ACCOUNT_PRIVATE_KEY
```

(See blockchain/hardhat.config.js with compare to blockchain/.env)

# 2. Compile

Make sure Ganache GUI is running. Then:

```shell
cd blockchain
npx hardhat compile
```

# 3. Deploy to Ganache

Make sure Ganache GUI is running. Then:

```shell
cd blockchain
npx hardhat run scripts/deploy.js --network ganache
```
