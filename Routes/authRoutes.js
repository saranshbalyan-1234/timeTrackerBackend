const express = require("express");
const Router = express.Router();
const authController = require("../Controllers/authController");

Router.post("/register", authController.register);
Router.post("/login", authController.login);
Router.post("/verify-email/:token", authController.verifyEmail);
Router.post("/reset-password/send-mail", authController.sendResetPasswordMail);
Router.post("/reset-password/:token", authController.resetPassword);
Router.get("/reset-password/:token", authController.getResetPasswordEmail);

module.exports = Router;
