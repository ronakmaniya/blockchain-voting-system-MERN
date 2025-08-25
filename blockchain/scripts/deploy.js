require("dotenv").config();
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("⏳ Deploying contract...");

  // Deploy contract with NO initial candidates
  const Voting = await ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();

  // Wait until deployment is mined
  await voting.waitForDeployment();

  const contractAddress = await voting.getAddress();
  console.log(`✅ Voting contract deployed at: ${contractAddress}`);

  // --- 1️⃣ Save deployed address in blockchain folder ---
  const addressPath = path.join(__dirname, "../deployedAddress.json");
  fs.writeFileSync(
    addressPath,
    JSON.stringify({ address: contractAddress }, null, 2)
  );
  console.log(`📂 Contract address saved to ${addressPath}`);

  // --- 2️⃣ Copy ABI to backend/abi folder ---
  const abiSourcePath = path.join(
    __dirname,
    "../artifacts/contracts/Voting.sol/Voting.json"
  );
  const abiDestPath = path.join(__dirname, "../../backend/abi/Voting.json");

  // Ensure backend/abi folder exists
  const abiDestDir = path.dirname(abiDestPath);
  if (!fs.existsSync(abiDestDir)) {
    fs.mkdirSync(abiDestDir, { recursive: true });
  }

  fs.copyFileSync(abiSourcePath, abiDestPath);
  console.log(`📄 ABI copied to ${abiDestPath}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
