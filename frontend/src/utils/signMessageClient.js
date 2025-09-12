// src/utils/signMessageClient.js
import { Wallet } from "ethers";

/**
 * Sign a message (nonce) using a raw private key in the browser.
 * IMPORTANT: Do NOT send private keys to the server. This runs purely in-memory.
 * @param {string} privateKey - 0x... private key string
 * @param {string} message - nonce to sign
 * @returns {Promise<string>} signature
 */
export async function signWithPrivateKey(privateKey, message) {
  if (!privateKey) throw new Error("privateKey required");
  if (!message) throw new Error("message required");

  // create an in-memory Wallet and sign the message
  const wallet = new Wallet(privateKey.trim());
  const signature = await wallet.signMessage(message);
  return signature;
}
