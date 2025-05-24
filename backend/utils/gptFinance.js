const OpenAI = require("openai");

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

const openai = new OpenAI({
  apiKey: 'Api key placeholder'
});

function generatePrompt(transactions, goals) {
  return `
You are a personal finance coach. A user has the following transaction data:
${JSON.stringify(transactions, null, 2)}

They have the following financial goals:
${JSON.stringify(goals, null, 2)}

Your job:
1. Analyze if the user is meeting their savings goal.
2. Identify overspending in any category.
3. Suggest practical changes to improve their habits.
4. Output a clear 7-day budget plan with specific limits or advice.
Use concise language and be encouraging. If data is missing, make reasonable assumptions.
`;
}

async function analyzeFinance(transactions, goals) {
  try {
    const prompt = generatePrompt(transactions, goals);
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("❌ GPT API Error:", error);
    return "Sorry, I couldn’t analyze your finances due to a technical issue.";
  }
}

module.exports = { analyzeFinance };
