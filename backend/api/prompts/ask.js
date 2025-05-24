const express = require("express");
const router = express.Router();
const { callGroqLLM } = require("../../gpt/groqClient");
const { getUserById } = require("../../db/queries/users");
const { getTransactionsByUserId } = require("../../db/queries/transactions");
const buildFinancePrompt = require("../../logic/buildFinancePrompt");

router.post("/", async (req, res) => {
  console.log("🔥 /api/prompts/ask endpoint HIT");

  try {
    const { user_id, question } = req.body;
    console.log("🧾 Incoming body:", req.body);

    const user = await getUserById(user_id);
    const transactions = await getTransactionsByUserId(user_id);

    const prompt = buildFinancePrompt({ user, transactions, question });

    console.log("🧠 Prompt input:");
    console.log(JSON.stringify({ user, transactions, question, prompt }, null, 2));

    const messages = [
      { role: "system", content: "You are a helpful finance assistant." },
      { role: "user", content: prompt }
    ];

    const reply = await callGroqLLM(messages);
    res.json({ response: reply });
  } catch (err) {
    console.error("❌ Prompt error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

module.exports = router;