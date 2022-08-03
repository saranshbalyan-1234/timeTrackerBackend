const express = require("express");
const Router = express.Router();
const trackingController = require("../Controllers/trackingController");

Router.get("/get", trackingController.findByParam);

module.exports = Router;
