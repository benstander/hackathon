// Utility to group spending by category
function summarizeSpending(transactions) {
  return transactions.reduce((acc, txn) => {
    const cat = txn.category || "Uncategorized";
    acc[cat] = (acc[cat] || 0) + txn.amount;
    return acc;
  }, {});
}

// Main builder function
function buildFinancePrompt({ transactions, user, question }) {
  const spending = summarizeSpending(transactions);

  const spendingLines = Object.entries(spending)
    .map(([cat, amt]) => `- ${cat}: $${Math.abs(amt).toFixed(2)}`)
    .join("\n");

  return `
You are a highly personalized and intelligent finance assistant. 
Base your response on the user's actual income, spending, and savings goals.
Be direct, empathetic, and realistic. Use markdown.

**User Info:**
- Name: ${user.name}
- Monthly Income: $${user.income}
- Monthly Savings Goal: $${user.savings_goal}

**Recent Spending by Category:**
${spendingLines}

**User's Question:**
${question}

Respond in markdown. Be helpful and financially sound.
If needed, suggest a chart, savings strategy, or tradeoff decision.
`.trim();
}

module.exports = { buildFinancePrompt };
