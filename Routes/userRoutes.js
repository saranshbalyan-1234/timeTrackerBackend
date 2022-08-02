const express = require("express");
const Router = express.Router();
const userController = require("../Controllers/userController");

Router.get("/get", userController.findAll);
Router.get("/get/:id", userController.findById);
Router.get("/getByParam", userController.findByParam);
Router.post("/save", userController.save);
Router.put("/update/:id", userController.update);
Router.delete("/delete/:id", userController.destroy);
Router.get("/raw", userController.rawQuery);

module.exports = Router;
