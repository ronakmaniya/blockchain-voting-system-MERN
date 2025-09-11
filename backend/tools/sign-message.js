// backend/tools/sign-message.js

const { Wallet } = require("ethers");
// const { verifyMessage } = require("ethers");

async function main() {
  const [, , privateKey, nonce] = process.argv;
  if (!privateKey || !nonce) {
    console.log("Usage: node sign-message.js <privateKey> <nonce>");
    process.exit(1);
  }
  const wallet = new Wallet(privateKey);
  // console.log(wallet);
  const signature = await wallet.signMessage(nonce);
  console.log(signature);
  // const recovered = verifyMessage(nonce, signature).toLowerCase();
  // console.log(recovered);
  // console.log(recovered == wallet.address.toLowerCase());
}

main();
