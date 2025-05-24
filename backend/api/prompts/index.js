// api/prompts/index.js

const express = require("express");
const router = express.Router();

router.use("/ask", require("./ask"));       // POST - send question to GPT
router.use("/edit", require("./edit"));     // PATCH - update saved prompt
router.use("/saved", require("./saved"));   // GET - fetch all saved prompts
router.use("/save", require("./save"));     // POST - create/save new prompt

module.exports = router;
