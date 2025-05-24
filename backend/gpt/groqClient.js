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
    throw new Error("Failed to get response from GROQ");
  }
}

module.exports = { callGroqLLM };
