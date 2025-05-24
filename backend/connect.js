const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

function setupAppMiddleware(app) {
  // Load env vars
  require("dotenv").config();

  // Logging (dev only)
  app.use(morgan("dev"));

  // CORS
  app.use(
    cors({
      origin: process.env.FRONTEND_ORIGIN || "*",
      credentials: true,
    })
  );

  // Parse JSON
  app.use(express.json());
}

module.exports = setupAppMiddleware;
