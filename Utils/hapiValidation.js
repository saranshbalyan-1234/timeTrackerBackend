const joi = require("@hapi/joi");

const registerValidation = joi.object({
  name: joi.string().min(3).required(),
  email: joi.string().min(5).required().email(),
  password: joi.string().min(6).required(),
});
const signinValidation = joi.object({
  email: joi.string().min(5).required().email(),
  password: joi.string().min(5).required(),
});
module.exports = { registerValidation, signinValidation };
