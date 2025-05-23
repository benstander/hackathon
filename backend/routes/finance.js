const express = require('express');
const router = express.Router();
const { analyzeFinance } = require('../utils/gptFinance');

const mockTransactions = [
  { date: "2024-05-01", category: "groceries", amount: 210 },
  { date: "2024-05-02", category: "dining", amount: 80 },
  { date: "2024-05-03", category: "transport", amount: 40 },
  { date: "2024-05-04", category: "savings", amount: 300 },
  { date: "2024-05-05", category: "entertainment", amount: 120 },
];

const userGoals = {
  targetSavings: 500,
  capPerCategory: {
    dining: 150,
    groceries: 400,
    entertainment: 100,
  },
};

router.post('/analyze', async (req, res) => {
  try {
    const report = await analyzeFinance(mockTransactions, userGoals);
    res.json({ report });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating finance report");
  }
});

module.exports = router;
