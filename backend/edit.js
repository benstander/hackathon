const express = require("express");
const router = express.Router();
const { updatePrompt } = require("../../db/queries/prompts");

router.patch("/", async (req, res) => {
  try {
    const { id, content } = req.body;
    const updated = await updatePrompt(id, content);
    res.json({ updated });
  } catch (err) {
    console.error("Edit error:", err);
    res.status(500).json({ error: "Failed to update prompt." });
  }
});

module.exports = router;