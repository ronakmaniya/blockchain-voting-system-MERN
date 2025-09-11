// backend/utils/signMessage.js
const { Wallet } = require("ethers");

/**
 * Signs a nonce using the provided private key.
 * @param {string} privateKey - The voter's private key.
 * @param {string} nonce - The random nonce from backend.
 * @returns {Promise<string>} The signed message (signature).
 */
async function signMessage(privateKey, nonce) {
  if (!privateKey || !nonce) {
    throw new Error("Private key and nonce are required");
  }

  const wallet = new Wallet(privateKey);
  const signature = await wallet.signMessage(nonce);
  return signature;
}

module.exports = { signMessage };
    