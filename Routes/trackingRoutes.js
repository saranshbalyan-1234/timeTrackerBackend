const express = require("express");
const Router = express.Router();
const trackingController = require("../Controllers/trackingController");

Router.post("/get", trackingController.findByParam);

module.exports = Router;
