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
GANACHE_URL=http://127.0.0.1:7545
#Paste a private key from Ganache GUI (of the first account). KEEP the 0x prefix.
GANACHE_PRIVATE_KEY=0xYOUR_GANACHE_ACCOUNT_PRIVATE_KEY
GANACHE_CHAIN_ID=1337
```

# 2. Compile

Make sure Ganache GUI is running. Then:

```shell
cd blockchain
npx hardhat compile
```

# 3. Deploy to Ganache

Make sure Ganache GUI is running. Then:

```shell
npx hardhat run scripts/deploy.js --network ganache
```
