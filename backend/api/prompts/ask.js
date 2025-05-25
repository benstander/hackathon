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

    const accessToken = await getAccessToken()
    const transactionObject = await listUserTransactions(accessToken, userId)
    const transactionsData = transactionObject.data

    const income = 0;
    const transactions = []

    for (const transactionData of transactionsData) {
      const transaction = {}
  
      // These classes have NO SUBCLASS OR UNKNOWN SUBCLASS
      if (transactionData.class === 'transfer' 
        || transactionData.class === 'bank-fee' 
        || transactionData.class === 'direct-credit' 
        || transactionData.class === 'cash-withdrawal'
      ) {
        if (transactionData.class === 'direct-credit') {
          income += Number(transactionData.amount)
        }
        transaction.category = transactionData.class
        transaction.amount = Number(transactionData.amount)
        transactions.push(transaction)
      }

      else {
        transaction.category = transactionData.subClass.title
        transaction.amount = Number(transactionData.amount)
        transactions.push(transaction)
      }
    }

    const user = {
      income: income,
      savingsGoal: 10000
    }

    const prompt = buildFinancePrompt(user, transactions, question);

    const messages = [
      { role: "system", content: "You are a helpful finance assistant." },
      { role: "user", content: prompt }
    ];

    const reply = await callGroqLLM(messages);
    res.json({ response: reply });
  } catch (err) {
    console.error("Prompt error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

module.exports = router;