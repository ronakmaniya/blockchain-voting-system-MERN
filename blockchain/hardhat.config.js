require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const {
  GANACHE_URL = "http://127.0.0.1:7545", // default if it is not set in .env
  GANACHE_PRIVATE_KEY = "", // blank if it is not set in .env
  GANACHE_CHAIN_ID = "1337", // default if it is not set in .env
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
