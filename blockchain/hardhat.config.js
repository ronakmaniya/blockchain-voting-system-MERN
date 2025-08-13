require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const {
  GANACHE_URL = "http://127.0.0.1:7545",
  GANACHE_PRIVATE_KEY = "",
  GANACHE_CHAIN_ID = "1337",
} = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    ganache: {
      url: GANACHE_URL,
      // only pass accounts if we actually set a private key
      accounts: GANACHE_PRIVATE_KEY ? [GANACHE_PRIVATE_KEY] : undefined,
      chainId: Number(GANACHE_CHAIN_ID),
    },
  },
};
