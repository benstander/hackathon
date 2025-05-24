const express = require("express");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const { getTransactionsByUserId } = require("../../db/queries/transactions");

const router = express.Router();
const width = 800;
const height = 600;
const chartCallback = (ChartJS) => {
  ChartJS.defaults.font.family = "Helvetica";
  ChartJS.defaults.font.size = 18;
  ChartJS.defaults.plugins.legend.position = "top";
};

const canvas = new ChartJSNodeCanvas({ width, height, chartCallback });

router.get("/spending", async (req, res) => {
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

    const config = {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Spending ($)",
            data,
            backgroundColor: "#537bc4",
            borderColor: "#3e5ba9",
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "Spending by Category",
            font: { size: 24 },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.label}: $${context.raw}`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Amount ($)"
            }
          },
          x: {
            title: {
              display: true,
              text: "Category"
            }
          }
        },
      },
    };

    const image = await canvas.renderToBuffer(config);
    res.set("Content-Type", "image/png");
    res.send(image);
  } catch (err) {
    console.error("❌ Bar Chart Error:", err);
    res.status(500).json({ error: "Failed to generate bar chart." });
  }
});

module.exports = router;


