const cors = require("cors");
const express = require("express");
const morgan  = require("morgan");

function setupAppMiddleware(app){
  require("dotenv").config();

  app.use(morgan("dev"))

  app.use(cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5175" || "http://localhost:5174" || "http://localhost:5173",
    credentials: true,
  }));

  app.use(express.json());

  app.use(express.urlencoded({extended: true}));


}

module.exports = setupAppMiddleware;