require("dotenv").config();
const express = require("express");
const { setupAppMiddleware } = require("./middleware");

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

// ✅ Centralized middleware setup
setupAppMiddleware(app);

// ✅ Health check
app.get("/", (req, res) => {
  res.send("✅ Finance GPT Backend is live.");
});

// ✅ Mount API routes
app.use("/api/prompts", require("./api/prompts"));
app.use("/api/basiq", require ("./api/basiq/basiq"));
app.use("/api/charts", require("./api/charts"));
app.use("/api/transactions", require("./api/transactions/sync"));

// ✅ 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
