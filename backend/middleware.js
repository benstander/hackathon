const cors = require("cors");
const express = require("express");
const morgan  = require("morgan");

function setupAppMiddleware(app){
  require("dotenv").config();

  app.use(morgan("dev"))

  app.use(cors({
    origin: '*',
  }));

  app.use(express.json());

  app.use(express.urlencoded({extended: true}));


}

module.exports = setupAppMiddleware;