// backend/services/blockListener.js
const { provider, iface } = require("../config/contract");
const Transaction = require("../models/Transaction");
const Election = require("../models/Election");
const { ethers } = require("ethers");

let listening = false;

function classifyTx(tx, receipt) {
  try {
    if (receipt && receipt.contractAddress) return "contract_creation";
    const hasData = tx.data && tx.data !== "0x";
    const valueBigInt = tx.value ? BigInt(tx.value.toString()) : 0n;
    if (valueBigInt > 0n && !hasData) return "value_transfer";
    if (hasData && tx.to) return "contract_call";
    return "other";
  } catch (e) {
    return "other";
  }
}

async function processTx(tx) {
  try {
    const receipt = await provider.getTransactionReceipt(tx.hash);
    const type = classifyTx(tx, receipt);

    const txDoc = {
      txHash: tx.hash,
      from: tx.from,
      to: tx.to || null,
      valueWei: tx.value?.toString?.() ?? null,
      valueEth: tx.value ? ethers.formatEther(tx.value) : null,
      blockNumber: tx.blockNumber,
      gasUsed: receipt?.gasUsed?.toString?.() ?? null,
      gasPrice: tx.gasPrice?.toString?.() ?? null,
      status: receipt
        ? receipt.status === 1
          ? "success"
          : "failed"
        : "pending",
      data: tx.data,
      decodedCall: null,
      type,
    };

    // optional decode using ABI
    if (iface && tx.data && tx.data !== "0x") {
      try {
        const parsed = iface.parseTransaction({
          data: tx.data,
          value: tx.value,
        });
        txDoc.decodedCall = {
          name: parsed.name,
          args: parsed.args.map((a) =>
            typeof a === "bigint" ? a.toString() : a
          ),
        };
      } catch (_) {
        txDoc.decodedCall = null;
      }
    }

    // Save transaction (dedupe by unique index)
    try {
      await Transaction.create(txDoc);
    } catch (err) {
      if (err.code !== 11000) console.error("Error saving Transaction:", err);
    }

    // Auto-create election for certain types (value_transfer only)
    const createFor = new Set(["value_transfer"]); // change if needed
    if (createFor.has(type)) {
      const existing = await Election.findOne({ txHash: tx.hash });
      if (!existing) {
        const title = `Vote on transaction ${tx.hash.slice(0, 10)}...`;
        const description = `Transaction from ${tx.from} to ${
          tx.to || "contract"
        } — ${txDoc.valueEth || "0"} ETH`;
        await Election.create({
          txHash: tx.hash,
          title,
          description,
          txSummary: {
            from: tx.from,
            to: tx.to,
            valueEth: txDoc.valueEth,
            blockNumber: tx.blockNumber,
            type,
          },
          status: "open",
          startAt: new Date(),
        });
        console.log("Election created for tx:", tx.hash);
      }
    }
  } catch (err) {
    console.error("processTx error:", err);
  }
}

async function processBlock(blockNumber) {
  try {
    const block = await provider.getBlock(blockNumber, true);
    if (!block) return;
    for (const tx of block.transactions) {
      processTx(tx).catch((e) => console.error("processTx unhandled:", e));
    }
  } catch (err) {
    console.error("processBlock error:", err);
  }
}

function startBlockListener() {
  if (listening) return;
  listening = true;

  (async () => {
    try {
      const latest = await provider.getBlockNumber();
      const start = Math.max(0, latest - 10); // ingest last 10 blocks on startup
      for (let b = start; b <= latest; b++) await processBlock(b);
    } catch (e) {
      console.error("initial ingest failed:", e);
    }
  })();

  provider.on("block", async (blockNumber) => {
    try {
      await processBlock(blockNumber);
    } catch (err) {
      console.error("block handler error:", err);
    }
  });

  console.log("Block listener started");
}

module.exports = { startBlockListener };
