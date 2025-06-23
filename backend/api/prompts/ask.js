const express = require("express");
const router = express.Router();
const { callGroqLLM } = require("../../gpt/groqClient");
const { getUserById } = require("../../db/queries/users");
const { getTransactionsByUserId } = require("../../db/queries/transactions");
const buildFinancePrompt = require("../../logic/buildFinancePrompt");

const {
  getAccessToken, 
  createUser, 
  getClientToken, 
  retrieveUser, 
  listUserAccounts, 
  retrieveUserAccount, 
  listUserTransactions, 
  retrieveUserTransaction
} = require('../../Utils/basiqHelper')

router.post("/", async (req, res) => {
  try {
    const { userId, question } = req.body;

    if (!userId || !question) {
      return res.status(400).json({ error: "Missing userId or question" });
    }

    let transactions = [];
    let income = 50000; // Default fallback income

    try {
      // Try to get real transaction data from Basiq
      const accessToken = await getAccessToken();
      const transactionObject = await listUserTransactions(accessToken, userId);
      const transactionsData = transactionObject.data || [];

      for (const transactionData of transactionsData) {
        const transaction = {};
    
        // These classes have NO SUBCLASS OR UNKNOWN SUBCLASS
        if (transactionData.class === 'transfer' 
          || transactionData.class === 'bank-fee' 
          || transactionData.class === 'direct-credit' 
          || transactionData.class === 'cash-withdrawal'
        ) {
          if (transactionData.class === 'direct-credit') {
            income += Number(transactionData.amount);
          }
          transaction.category = transactionData.class;
          transaction.amount = Number(transactionData.amount);
          transactions.push(transaction);
        } else {
          transaction.category = transactionData.subClass?.title || transactionData.class;
          transaction.amount = Number(transactionData.amount);
          transactions.push(transaction);
        }
      }
    } catch (basiqError) {
      console.warn("Basiq API error, using fallback data:", basiqError.message);
      // Use fallback transaction data if Basiq fails
      transactions = [
        { category: 'Food & Dining', amount: 450 },
        { category: 'Transportation', amount: 200 },
        { category: 'Shopping', amount: 300 },
        { category: 'Entertainment', amount: 150 },
        { category: 'Utilities', amount: 180 }
      ];
    }

    const user = {
      income: income,
      savingsGoal: 10000
    };

    const prompt = buildFinancePrompt(user, transactions, question);

    const messages = [
      { role: "system", content: "You are a helpful finance assistant. Provide clear, actionable advice based on the user's financial situation." },
      { role: "user", content: prompt }
    ];

    const reply = await callGroqLLM(messages);
    res.json({ response: reply });
  } catch (err) {
    console.error("Prompt error:", err);
    
    // Provide a helpful fallback response if AI fails
    const fallbackResponse = "I'm having trouble accessing your financial data right now, but I'm here to help! You can ask me general financial questions, and I'll do my best to provide helpful advice. Please try again in a moment.";
    
    res.json({ response: fallbackResponse });
  }
});

module.exports = router;