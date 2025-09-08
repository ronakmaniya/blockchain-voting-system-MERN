// backend/tools/sign-message.js
// Usage: node tools/sign-message.js <privateKey> <nonce>
const { Wallet } = require("ethers");

async function main() {
  const [, , privateKey, nonce] = process.argv;
  if (!privateKey || !nonce) {
    console.log("Usage: node sign-message.js <privateKey> <nonce>");
    process.exit(1);
  }
  const wallet = new Wallet(privateKey);
  const signature = await wallet.signMessage(nonce);
  console.log(signature);
}

main();
