const db = require("../Utils/dataBaseConnection");
const { userLoginValidation } = require("../Utils/hapiValidation");
const getError = require("../Utils/sequelizeError");
const Tracking = db.tracking;

const findByParam = async (req, res) => {
  await Tracking.findOne({
    // order: [["title", "DESC"]],
    // attributes: ["username"],
    where: { id: req.user.id, date: req.body.date },
  })
    .then((resp) => {
      res.status(200).json(resp);
    })
    .catch((e) => {
      getError(e, res);
    });
};

module.exports = {
  findByParam,
};
