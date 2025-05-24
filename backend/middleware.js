const cors = require("cors");
const express = require("express");
const morgan  = require("morgan");

function setupAppMiddleware(app){
  require("dotenv").config();

  app.use(morgan("deb)"))

  app.use(cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
    credentials: true,
  }));

  app.use(express.json());

  app.use(express.urlencoded({extended: true}));


}

module.exports = setupAppMiddleware;