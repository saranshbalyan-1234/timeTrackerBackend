const nodemailer = require("nodemailer");
const { createToken } = require("../Utils/jwt");
const registerHTML = require("../Utils/Mail/HTML/register");
const resetPasswordHtml = require("../Utils/Mail/HTML/resetPassword");
var transporter = nodemailer.createTransport({
  //   host: "smtp.example.com",
  //   port: 587,
  //   secure: false, // upgrade later with STARTTLS
  service: "gmail",
  auth: {
    user: "saranshbalyan1234@gmail.com",
    pass: "cwybqmfmlrskndfz",
  },
});

var mailOptions = {
  from: "sender",
  to: "reciever",
  subject: "subject",
  text: `text`,
  html: "<h1>html</h1>",
};

const sendMailApi = (req, res) => {
  transporter.sendMail(req.body, function (error, info) {
    if (error) {
      res.status(200).json({ errors: [error] });
    } else {
      res.status(200).json(info);
    }
  });
};
const sendMail = async (data, type) => {
  let mailOption = {
    to: "",
    subject: "",
    text: "",
    html: "",
  };
  let token = "";
  let link = "";
  switch (type) {
    case "register":
      token = await createToken(
        { id: data.id },
        process.env.JWT_VERIFICATION_SECRET,
        process.env.JWT_VERIFICATION_EXPIRATION
      );
      link = `${process.env.WEBSITE_HOME}/verify-email/${token}`;
      mailOption = {
        to: data.email,
        subject: "Registration Successfull",
        html: registerHTML(data.name, link),
      };
      break;
    case "reset-password":
      token = await createToken(
        { email: data.email },
        process.env.JWT_RESET_SECRET,
        process.env.JWT_RESET_EXPIRATION
      );
      link = `${process.env.WEBSITE_HOME}/reset-password/${token}`;
      mailOption = {
        to: data.email,
        subject: "Password Reset",
        html: resetPasswordHtml(data.name, link),
      };
      break;
  }
  transporter.sendMail(
    { ...mailOption, from: process.env.MAILER_FROM },
    function (error, info) {
      if (error) {
        console.log("Failed to send email");
      } else {
        console.log("Email Sent");
      }
    }
  );
};
module.exports = { sendMailApi, sendMail };
