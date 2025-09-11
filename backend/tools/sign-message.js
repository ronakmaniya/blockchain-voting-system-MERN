// backend/tools/sign-message.js
const { signMessage } = require("../utils/signMessage");

async function main() {
  const [, , privateKey, nonce] = process.argv;

  if (!privateKey || !nonce) {
    console.log(
      "Usage: node backend/tools/sign-message.js <privateKey> <nonce>"
    );
    process.exit(1);
  }

  try {
    const signature = await signMessage(privateKey, nonce);
    console.log("Signature:", signature);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

main();
