const path = require("path");
const fs = require("fs");
const { ethers } = require("ethers");
const env = require("./env");

// Load deployed address from blockchain
const deployedAddressPath = path.join(
  __dirname,
  "..",
  "..",
  "blockchain",
  "deployedAddress.json"
);
const { address: contractAddress } = JSON.parse(
  fs.readFileSync(deployedAddressPath, "utf8")
);

// Load ABI
const abiPath = path.join(__dirname, "..", "abi", "Voting.json");
const contractABI = require(abiPath).abi;

// Provider & Wallet
const provider = new ethers.JsonRpcProvider(env.rpcUrl);
const wallet = new ethers.Wallet(env.privateKey, provider);

// Contract instance
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

module.exports = contract;
