// backend/config/contract.js
const path = require("path");
const fs = require("fs");
const { ethers } = require("ethers");
const { rpcUrl } = require("./env"); // centralized config

const RPC_URL = rpcUrl || "http://127.0.0.1:7545";

const deployedPath = path.join(
  __dirname,
  "..",
  "..",
  "blockchain",
  "deployedAddress.json"
);
const abiPath = path.join(__dirname, "..", "abi", "Voting.json");

const provider = new ethers.JsonRpcProvider(RPC_URL);

let contractAddress = null;
if (fs.existsSync(deployedPath)) {
  const deployed = JSON.parse(fs.readFileSync(deployedPath, "utf8"));
  contractAddress = deployed.address;
} else {
  console.warn(
    "⚠️ deployedAddress.json not found — using CONTRACT_ADDRESS from env"
  );
  contractAddress = process.env.CONTRACT_ADDRESS || null;
}

const contractABI = fs.existsSync(abiPath) ? require(abiPath).abi : null;

let contract = null;
let iface = null;

if (contractAddress && contractABI) {
  contract = new ethers.Contract(contractAddress, contractABI, provider);
  iface = new ethers.Interface(contractABI); // ✅ create iface here
} else {
  console.error("❌ Missing contractAddress or ABI. Contract not initialized.");
}

module.exports = {
  provider,
  contractAddress,
  contractABI,
  contract,
  iface, // ✅ export for decoding tx input data
};
