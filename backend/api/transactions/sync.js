const express = require("express");
const router = express.Router();
const { insertTransactions } = require("../../db/queries/transactions");

router.post("/", async (req, res) => {
  try {
    const { user_id, new_transactions } = req.body;
    console.log("🧾 Incoming:", req.body);

    if (!user_id || !Array.isArray(new_transactions)) {
      return res.status(400).json({ error: "Missing or invalid user_id or new_transactions." });
    }

    const transactions = new_transactions.map((tx) => ({
      user_id,
      amount: tx.amount,
      category: tx.category,
      merchant: tx.merchant || null,
      description: tx.description || null,
      date: new Date().toISOString(),
      created_at: new Date().toISOString()
    }));

    const inserted = await insertTransactions(user_id, transactions);
    res.json({ inserted });
  } catch (err) {
    console.error("❌ Transaction sync error:", err);
    res.status(500).json({ error: "Failed to sync transactions." });
  }
});

module.exports = router;
