const db = require("../Utils/dataBaseConnection");
const { userLoginValidation } = require("../Utils/hapiValidation");
const getError = require("../Utils/sequelizeError");
const Tracking = db.tracking;

const findByParam = async (req, res) => {
  await Tracking.findOne({
    // order: [["title", "DESC"]],
    // attributes: ["username"],
    where: { user_id: req.user.id, date: req.body.date },
  })
    .then((resp) => {
      if (!resp)
        return res.status(400).json({ errors: ["No Tracking Data Found"] });
      if (resp) return res.status(200).json(JSON.parse(resp.data));
    })
    .catch((e) => {
      getError(e, res);
    });
};

module.exports = {
  findByParam,
};
