const express = require("express");
const router = express.Router();
const { supabase } = require("../../db/supabaseClient");

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) throw error;
    res.json({ user: data.user });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed." });
  }
});

module.exports = router;