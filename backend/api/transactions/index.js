const express = require("express");
const router = express.Router();

router.use("/sync", require("./sync"));

module.exports = router;
