// logic/buildFinancePrompt.js

function buildFinancePrompt({ user, transactions, question }) {
  let summary = `The user has an income of $${user.income} and a savings goal of $${user.savings_goal}. `;
  summary += `Their recent spending includes:\n`;

  const categoryTotals = {};

  for (const tx of transactions) {
    categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
  }

  for (const [category, total] of Object.entries(categoryTotals)) {
    summary += `- ${category}: $${total.toFixed(2)}\n`;
  }

  summary += `\nQuestion: ${question}`;
  return summary;
}

module.exports = buildFinancePrompt;
