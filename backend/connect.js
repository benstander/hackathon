const express = require("express");
const cors = require("cors");

function setupAppMiddleware(app) {
  app.use(cors());
  app.use(express.json());
}

module.exports = setupAppMiddleware;
