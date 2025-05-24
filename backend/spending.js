const express = require("express");
const router = express.Router();
const { getTransactionsByUserId } = require("../../db/queries/transactions");

router.get("/", async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: "Missing user_id" });

    const transactions = await getTransactionsByUserId(user_id);
    const breakdown = {};

    for (const tx of transactions) {
      if (!breakdown[tx.category]) breakdown[tx.category] = 0;
      breakdown[tx.category] += tx.amount;
    }

    res.json({ breakdown });
  } catch (err) {
    console.error("Chart error:", err);
    res.status(500).json({ error: "Could not fetch spending breakdown." });
  }
});

module.exports = router;
