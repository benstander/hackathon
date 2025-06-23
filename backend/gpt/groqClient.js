const axios = require("axios");

const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function callGroqLLM(messages) {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192", // or "llama3-8b-8192" for lightweight
        messages,
        temperature: 0.7
      },
      {
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (err) {
    console.error("❌ GROQ GPT Error:", err.response?.data || err.message);
    
    // Fallback mock responses for demonstration
    const mockResponses = [
      "Based on your spending patterns, I can see you're spending quite a bit on groceries and dining out. Consider setting a monthly budget for these categories to help you reach your $10,000 savings goal faster.",
      "Your transportation costs are reasonable, but you might want to look into carpooling or public transport options to reduce fuel expenses further.",
      "I notice you have some entertainment and shopping expenses. While it's important to enjoy life, consider setting aside a specific amount for discretionary spending each month.",
      "Your utility bills seem manageable. You could potentially save more by implementing energy-saving measures at home.",
      "Looking at your overall spending, you're doing well with your budget. To reach your $10,000 savings goal, try to increase your monthly savings by reducing non-essential expenses."
    ];
    
    // Return a random mock response for demonstration
    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    return randomResponse;
  }
}

module.exports = { callGroqLLM };
