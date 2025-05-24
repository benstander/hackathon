// 📁 backend/api/charts/taxPie.js
const express = require("express");
const router = express.Router();
const { getTransactionsByUserId } = require("../../db/queries/transactions");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");

const width = 600;
const height = 400;
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

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

    const labels = Object.keys(breakdown);
    const data = Object.values(breakdown);

    const config = {
      type: "pie",
      data: {
        labels,
        datasets: [
          {
            label: "Spending Breakdown by Category",
            data,
            borderWidth: 1
          }
        ]
      }
    };

    const image = await chartJSNodeCanvas.renderToBuffer(config);
    res.set("Content-Type", "image/png");
    res.send(image);
  } catch (err) {
    console.error("Pie Chart Error:", err);
    res.status(500).json({ error: "Failed to generate pie chart." });
  }
});

module.exports = router;
