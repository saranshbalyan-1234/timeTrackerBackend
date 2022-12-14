const db = require("../Utils/dataBaseConnection");
const bcrypt = require("bcryptjs");
const { createToken, getTokenError } = require("../Utils/jwt");
const { sendMail } = require("../Utils/nodeMailer");
const { verify } = require("jsonwebtoken");
const {
  registerValidation,
  signinValidation,
} = require("../Utils/hapiValidation");
const getError = require("../Utils/sequelizeError");
const e = require("express");
// const joi = require("@hapi/joi");
const User = db.users;

const register = async (req, res) => {
  const { error } = registerValidation.validate(req.body);
  if (error)
    return res.status(400).json({ errors: [error.details[0].message] });

  const { name, email, password } = req.body;
  bcrypt.hash(password, 8).then((hash) => {
    User.create({ name, email, password: hash })
      .then((resp) => {
        sendMail({ email, name, id: resp.id }, "register");
        res.status(200).json({ id: resp.id, name, email });
      })
      .catch((e) => {
        getError(e, res);
      });
  });
};
const signin = async (req, res) => {
  const { error } = signinValidation.validate(req.body);
  if (error)
    return res.status(400).json({ errors: [error.details[0].message] });

  const { email, password } = req.body;
  User.findOne({ where: { email } })
    .then((resp) => {
      if (!resp)
        return res.status(400).json({ errors: ["User Not Registered"] });
      bcrypt.compare(password, resp.password, async (err, result) => {
        if (!result)
          return res.status(400).json({ errors: ["Incorrect Password"] });
        const { id, email, name, verifiedAt } = resp;
        if (!verifiedAt)
          return res.status(400).json({ errors: ["Email Not Verified"] });

        let tokenData = { id, email };
        const accessToken = await createToken(
          tokenData,
          process.env.JWT_ACCESS_SECRET,
          process.env.JWT_ACCESS_EXPIRATION
        );
        const refreshToken = await createToken(
          tokenData,
          process.env.JWT_REFRESH_SECRET,
          process.env.JWT_REFRESH_EXPIRATION
        );

        res.status(200).json({ id, name, email, accessToken, refreshToken });
      });
    })
    .catch((e) => {
      res.status(500).json(e);
    });
};

const verifyEmail = async (req, res) => {
  try {
    const data = verify(req.params.token, process.env.JWT_VERIFICATION_SECRET);
    if (data) {
      await User.findByPk(data.id)
        .then(async (response) => {
          if (response) {
            if (response.verifiedAt)
              return res
                .status(400)
                .json({ errors: ["Email Already Verified"] });
            await User.update(
              { verifiedAt: new Date() },
              {
                where: {
                  id: data.id,
                },
              }
            )
              .then((resp) => {
                res
                  .status(200)
                  .json({ message: "Email Verification Successfull" });
              })
              .catch((e) => {
                getError(e, res);
              });
          } else {
            res.status(400).json({ errors: ["User not found"] });
          }
        })
        .catch((e) => {
          getError(e, res);
        });
    }
  } catch (e) {
    res.status(400).json({ errors: [getTokenError(e, "Email Verification")] });
  }
};
const resetPassword = async (req, res) => {
  try {
    const data = verify(req.params.token, process.env.JWT_RESET_SECRET);
    if (data) {
      bcrypt.hash(req.body.password, 8).then(async (hash) => {
        await User.update(
          { password: hash },
          {
            where: {
              email: data.email,
            },
          }
        )
          .then((resp) => {
            if (resp[0]) {
              res.status(200).json({ message: "Password Reset Successfull" });
            } else {
              res.status(400).json({ errors: ["User not found"] });
            }
          })
          .catch((e) => {
            getError(e, res);
          });
      });
    }
  } catch (e) {
    res.status(400).json({ errors: [getTokenError(e, "Password Reset")] });
  }
};
const getResetPasswordEmail = async (req, res) => {
  try {
    const data = verify(req.params.token, process.env.JWT_RESET_SECRET);
    if (data) {
      await User.findOne({
        where: { email: data.email },
      })
        .then((resp) => {
          if (!resp)
            return res.status(400).json({ errors: ["User Not Found"] });
          res.status(200).json(resp);
        })
        .catch((e) => {
          getError(e, res);
        });
    }
  } catch (e) {
    res.status(400).json({ errors: [getTokenError(e, "Password Reset")] });
  }
};
const sendResetPasswordMail = async (req, res) => {
  const { email } = req.body;
  await User.findOne({
    where: { email },
  })
    .then((resp) => {
      if (resp) {
        sendMail({ email, name: resp.name }, "reset-password");
        return res
          .status(200)
          .json({ message: "Email Verification Successfull" });
      } else {
        return res.status(400).json({ errors: ["User not found"] });
      }
    })
    .catch((e) => {
      getError(e, res);
    });
};
module.exports = {
  signin,
  register,
  verifyEmail,
  resetPassword,
  sendResetPasswordMail,
  getResetPasswordEmail,
};
