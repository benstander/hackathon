// 📁 api/charts/pie.js
const express = require("express");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const { getTransactionsByUserId } = require("../../db/queries/transactions");

const router = express.Router();
const width = 800;
const height = 600;
const chartCallback = (ChartJS) => {
  ChartJS.defaults.font.family = "Helvetica";
  ChartJS.defaults.font.size = 18;
  ChartJS.defaults.plugins.legend.position = "right";
};

const canvas = new ChartJSNodeCanvas({ width, height, chartCallback });

router.get("/tax", async (req, res) => {
  try {
    const { user_id } = req.query;
    const transactions = await getTransactionsByUserId(user_id);

    const categoryMap = {};
    for (const tx of transactions) {
      if (!categoryMap[tx.category]) categoryMap[tx.category] = 0;
      categoryMap[tx.category] += tx.amount;
    }

    const labels = Object.keys(categoryMap);
    const data = Object.values(categoryMap);

    const colors = [
      "#4dc9f6", "#f67019", "#f53794", "#537bc4", "#acc236",
      "#166a8f", "#00a950", "#58595b", "#8549ba", "#b0a1ff"
    ];

    const config = {
      type: "pie",
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderWidth: 2,
          hoverOffset: 20,
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "Spending Breakdown by Category",
            font: { size: 24 }
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const value = context.raw;
                const percent = ((value / total) * 100).toFixed(1);
                return `${context.label}: $${value} (${percent}%)`;
              }
            }
          },
          legend: {
            labels: {
              color: "#333",
              padding: 20,
              boxWidth: 20
            }
          }
        }
      }
    };

    const image = await canvas.renderToBuffer(config);
    res.set("Content-Type", "image/png");
    res.send(image);
  } catch (err) {
    console.error("❌ Pie Chart Error:", err);
    res.status(500).json({ error: "Failed to generate pie chart." });
  }
});

module.exports = router;
