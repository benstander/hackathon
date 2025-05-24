const express = require("express");
const router = express.Router();
const { supabase } = require("../../db/supabaseClient");

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    res.json({ session: data.session, user: data.user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(401).json({ error: "Invalid login." });
  }
});

module.exports = router;