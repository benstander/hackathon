// logic/buildFinancePrompt.js

function buildFinancePrompt(user, transactions, question ) {
  let summary = `The user has an income of $${user.income} and a savings goal of $${user.savingsGoal}. `;
  summary += `Their recent spending includes:\n`;

  const categoryTotals = {};

  for (const transaction of transactions) {
    categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount;
  }

  for (const [category, total] of Object.entries(categoryTotals)) {
    summary += `- ${category}: $${total.toFixed(2)}\n`;
  }

  summary += `\nQuestion: ${question}`;
  return summary;
}

module.exports = buildFinancePrompt;
