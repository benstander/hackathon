const express = require("express");
const router = express.Router();
const { buildFinancePrompt } = require("../../logic/buildFinancePrompt");
const { callGroqLLM } = require("../../gpt/groqClient");
const { 
  getAccessToken, 
  listUserTransactions 
} = require("../../Utils/basiqHelper");
const { 
  getUserById 
} = require("../../db/queries/users");

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD'
  }).format(amount);
};

router.post("/", async (req, res) => {
  try {
    const { userId, question } = req.body;

    if (!userId || !question) {
      return res.status(400).json({ error: "User ID and question are required" });
    }

    let transactions = [];
    let income = 50000; // Default fallback income
    let userHasRealData = false;

    try {
      // Get user from database to check if they have a Basiq user ID
      const user = await getUserById(userId);
      
      if (user?.basiq_user_id) {
        console.log(`Using real Basiq data for user: ${user.basiq_user_id}`);
        
        // Try to get real transaction data from Basiq
        const accessToken = await getAccessToken();
        const transactionObject = await listUserTransactions(accessToken, user.basiq_user_id);
        const transactionsData = transactionObject.data || [];

        userHasRealData = true;
        income = 0; // Reset income to calculate from actual data

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
            transaction.description = transactionData.description || '';
            transaction.date = transactionData.postDate || transactionData.transactionDate;
            transactions.push(transaction);
          } else {
            transaction.category = transactionData.subClass?.title || transactionData.class;
            transaction.amount = Number(transactionData.amount);
            transaction.description = transactionData.description || '';
            transaction.date = transactionData.postDate || transactionData.transactionDate;
            transactions.push(transaction);
          }
        }

        // If no income detected from transactions, use a reasonable default
        if (income === 0) {
          income = 60000; // Default for users with real data but no detected income
        }

        console.log(`Processed ${transactions.length} real transactions for user ${userId}`);
      } else {
        console.log(`No Basiq user ID found for user ${userId}, using demo data`);
        throw new Error("No real bank connection found");
      }
    } catch (basiqError) {
      console.warn("Using fallback demo data:", basiqError.message);
      userHasRealData = false;
      
      // Use fallback transaction data if Basiq fails or user has no connection
      transactions = [
        { 
          category: 'Food & Dining', 
          amount: 450, 
          description: 'Various restaurant and grocery purchases',
          date: new Date().toISOString().split('T')[0]
        },
        { 
          category: 'Transportation', 
          amount: 200, 
          description: 'Public transport and ride-sharing',
          date: new Date().toISOString().split('T')[0]
        },
        { 
          category: 'Shopping', 
          amount: 300, 
          description: 'Clothing and household items',
          date: new Date().toISOString().split('T')[0]
        },
        { 
          category: 'Entertainment', 
          amount: 150, 
          description: 'Movies, games, and subscriptions',
          date: new Date().toISOString().split('T')[0]
        },
        { 
          category: 'Utilities', 
          amount: 180, 
          description: 'Electricity, gas, and internet',
          date: new Date().toISOString().split('T')[0]
        }
      ];
      income = 50000; // Default income for demo data
    }

    const user = {
      income: income,
      savingsGoal: 10000,
      hasRealData: userHasRealData
    };

    // Build the finance prompt with context about data source
    const prompt = buildFinancePrompt(user, transactions, question);

    const messages = [
      { 
        role: "system", 
        content: `You are a helpful Australian finance assistant. Provide clear, actionable advice based on the user's financial situation. 
        
        ${userHasRealData 
          ? "You are working with REAL financial data from the user's connected bank accounts. Be specific and reference actual transaction patterns when relevant."
          : "You are working with DEMO/SAMPLE data since the user hasn't connected their bank account yet. Make it clear that connecting their bank would provide more personalized insights."
        }
        
        Always format currency amounts in Australian dollars (AUD). When discussing spending patterns, be specific about timeframes and categories.` 
      },
      { role: "user", content: prompt }
    ];

    const response = await callGroqLLM(messages);

    // Add a note about data source if using demo data
    let finalResponse = response;
    if (!userHasRealData) {
      finalResponse += "\n\n💡 *Note: This analysis is based on sample data. Connect your bank account for personalized insights based on your actual spending patterns.*";
    }

    res.json({ 
      response: finalResponse,
      dataSource: userHasRealData ? 'real' : 'demo',
      transactionCount: transactions.length,
      estimatedIncome: formatCurrency(income)
    });

  } catch (error) {
    console.error("AI Response Error:", error);
    res.status(500).json({ 
      error: "Sorry, I encountered an error processing your request. Please try again." 
    });
  }
});

module.exports = router;