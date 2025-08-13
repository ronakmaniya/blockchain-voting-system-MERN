// scripts/deploy.js
require("dotenv").config();
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const initialCandidates = ["Alice", "Bob", "Charlie"];

  const Voting = await ethers.getContractFactory("Voting");
  console.log("⏳ Deploying contract...");

  const voting = await Voting.deploy(initialCandidates);

  // Wait until deployment is mined
  await voting.waitForDeployment();

  const contractAddress = await voting.getAddress();
  console.log(`✅ Voting contract deployed at: ${contractAddress}`);

  // Save address to file
  const filePath = path.join(__dirname, "../deployedAddress.json");
  fs.writeFileSync(filePath, JSON.stringify({ address: contractAddress }, null, 2));
  console.log(`📂 Contract address saved to ${filePath}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
