// logic/buildFinancePrompt.js


function buildFinancePrompt(user, transactions, question ) {
  let summary = `The user has an income of $${user.income} and a savings goal of $${user.savingsGoal}. `;
  summary += `Their recent spending in each category includes:\n`;

  const categoryTotals = {};

  for (const transaction of transactions) {
    categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount;
  }

  for (const [category, total] of Object.entries(categoryTotals)) {
    summary += `- ${category}: $${total.toFixed(2)}\n`;
  }

  // summary += `These are the individual transactions with descriptions, categories and dates:\n`
  // for (const transaction of transactions) { 
  //   summary += `- Description: ${transaction.description}, Category: ${transaction.category}, Date: ${transaction.date}\n`
  // } 
  
  summary += `\nQuestion: ${question}`;
  summary += `\nEXCLUDE TRANSFERS AND DON'T SAY THAT YOU ARE EXCLUDING IT IN YOUR RESPONSE`;
  summary += `\nPlease output the responses as plain text sentences, without any * or other markdown markers.`;
  // summary += `\nPlease format your response using markdown, add markdown newlines when appropriate`;


  console.log("SUMMARY", summary)

  return summary;
}


// function buildFinancePrompt(user, transactions, question ) {
//   let summary = `The user has an income of $${user.income} and a savings goal of $${user.savingsGoal}. `;
//   summary += `Their recent spending includes:\n`;

//   const categoryTotals = {};

//   for (const transaction of transactions) {
//     categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount;
//   }

//   for (const [category, total] of Object.entries(categoryTotals)) {
//     summary += `- ${category}: $${total.toFixed(2)}\n`;
//   }

//   summary += `\nQuestion: ${question}`;
//   console.log("SUMMARY", summary)

//   return summary;
// }

module.exports = buildFinancePrompt;
