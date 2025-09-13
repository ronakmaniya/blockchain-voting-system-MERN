// backend/services/blockListener.js
const { provider, iface } = require("../config/contract");
const Transaction = require("../models/Transaction");
const Election = require("../models/Election");
const { ethers } = require("ethers");
const env = require("../config/env");

let listening = false;

function classifyTx(tx, receipt) {
  try {
    if (receipt && receipt.contractAddress) return "contract_creation";

    const hasData = tx && tx.data && tx.data !== "0x";
    // tx.value may be a BigNumber or undefined
    const valueStr = tx && tx.value != null ? tx.value.toString() : "0";
    const valueBigInt = valueStr ? BigInt(valueStr) : 0n;

    if (valueBigInt > 0n && !hasData) return "value_transfer";
    if (hasData && tx.to) return "contract_call";
    return "other";
  } catch (e) {
    return "other";
  }
}

async function processTx(txOrHash) {
  try {
    const txHash = typeof txOrHash === "string" ? txOrHash : txOrHash?.hash;
    if (!txHash) {
      console.warn("processTx: missing tx hash; skipping", txOrHash);
      return;
    }

    let tx =
      typeof txOrHash === "string"
        ? await provider.getTransaction(txHash)
        : txOrHash;
    if (!tx) {
      console.warn("processTx: could not fetch tx for hash", txHash);
      return;
    }

    const receipt = await provider.getTransactionReceipt(txHash);
    const type = classifyTx(tx, receipt);

    const txDoc = {
      txHash,
      from: tx.from || null,
      to: tx.to || null,
      valueWei: tx.value != null ? tx.value.toString() : null,
      valueEth: tx.value != null ? ethers.formatEther(tx.value) : null,
      blockNumber: tx.blockNumber ?? receipt?.blockNumber ?? null,
      gasUsed: receipt?.gasUsed?.toString?.() ?? null,
      gasPrice: tx.gasPrice?.toString?.() ?? null,
      status: receipt
        ? receipt.status === 1
          ? "success"
          : "failed"
        : "pending",
      data: tx.data ?? null,
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
      } catch (err) {
        txDoc.decodedCall = null;
      }
    }

    // Save transaction (dedupe)
    try {
      await Transaction.create(txDoc);
    } catch (err) {
      if (err.code === 11000) {
        // duplicate — optionally update status if changed (not mandatory)
      } else {
        console.error("Error saving Transaction:", err);
      }
    }

    // Auto-create election for certain types (value_transfer only)
    const createFor = new Set(["value_transfer"]);
    if (createFor.has(type)) {
      const existing = await Election.findOne({ txHash });
      if (!existing) {
        const title = `Vote on transaction ${txHash.slice(0, 10)}...`;
        const description = `Transaction from ${tx.from} to ${
          tx.to || "contract"
        } — ${txDoc.valueEth || "0"} ETH`;

        // Determine duration and endAt
        const durationMinutes = Number(env.electionDurationMinutes) || 60;
        const startAt = new Date();
        const endAt = new Date(startAt.getTime() + durationMinutes * 60 * 1000);

        await Election.create({
          txHash,
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
          startAt,
          endAt,
          durationMinutes,
        });
        console.log(
          "Election created for tx:",
          txHash,
          `endAt=${endAt.toISOString()}`
        );
      }
    }
  } catch (err) {
    console.error("processTx error:", err);
  }
}

async function processBlock(blockNumber) {
  try {
    const block = await provider.getBlock(blockNumber, true);
    if (!block) {
      console.warn("processBlock: block not found", blockNumber);
      return;
    }

    // If the provider returned only hashes (strings) instead of tx objects,
    // processTx handles hash strings and will fetch full txs itself.
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

  console.log("✅ Block listener started");
}

module.exports = { startBlockListener };
