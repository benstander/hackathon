// api/prompts/save.js

const express = require("express");
const router = express.Router();
const { supabase } = require("../../db/supabaseClient");

router.post("/", async (req, res) => {
  try {
    const { user_id, name, content } = req.body;

    const { data, error } = await supabase
      .from("prompts")
      .insert([{ user_id, name, content }])
      .select();

    if (error) throw error;
    res.json({ saved: data });
  } catch (err) {
    console.error("Prompt save error:", err);
    res.status(500).json({ error: "Failed to save prompt." });
  }
});

module.exports = router;
