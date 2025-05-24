// 📁 api/charts/index.js
const express = require("express");
const router = express.Router();

router.use("/spending", require("./spending"));      // existing route
router.use("/pie/tax", require("./taxPie"));         // ✅ now correctly mapped
router.use("/bar", require("./bar"));


module.exports = router;
