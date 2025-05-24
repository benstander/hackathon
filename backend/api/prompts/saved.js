const express = require("express");
const router = express.Router();
const { getPromptsByUserId } = require("../../db/queries/prompts");

router.get("/", async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: "Missing user_id" });

    const prompts = await getPromptsByUserId(user_id);
    res.json({ prompts });
  } catch (err) {
    console.error("Fetch prompts error:", err);
    res.status(500).json({ error: "Could not fetch prompts." });
  }
});

module.exports = router; // ✅ This MUST be at the bottom
