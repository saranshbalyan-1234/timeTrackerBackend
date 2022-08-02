const db = require("../Utils/dataBaseConnection");
const getError = require("../Utils/sequelizeError");

const { Op, QueryTypes } = require("sequelize");
const User = db.users;

const save = async (req, res) => {
  await User.create(req.body, {
    // fields: ["name", "email"],
  })
    .then((resp) => {
      res.status(200).json(resp);
    })
    .catch((e) => {
      getError(e, res);
    });
};

const update = async (req, res) => {
  await User.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then(async (resp) => {
      if (resp[0]) {
        await User.findByPk(req.params.id)
          .then((resp) => {
            res.status(200).json(resp);
          })
          .catch((e) => {
            res.status(500).json(e);
          });
      } else {
        res.status(400).json({ errors: ["Record not found"] });
      }
    })
    .catch((e) => {
      getError(e, res);
    });
};
const findById = async (req, res) => {
  await User.findByPk(req.params.id)
    .then((resp) => {
      res.status(200).json(resp);
    })
    .catch((e) => {
      getError(e, res);
    });
};
const findAll = async (req, res) => {
  //   User.scope(["name"]).findAll;
  await User.findAll({
    // order: [["title", "DESC"]],
    // where: {
    //   [Op.and]: [{ id: 1 }, { name: "saransh" }],
    // },
    // attributes: ["username"],
    //   include: [{ model: Car, attributes: ["name"], as: "nameChange" }],
  })
    .then((resp) => {
      res.status(200).json(resp);
    })
    .catch((e) => {
      getError(e, res);
    });
};

const findByParam = async (req, res) => {
  await User.findOne({
    // order: [["title", "DESC"]],
    // attributes: ["username"],
    where: req.body,
  })
    .then((resp) => {
      res.status(200).json(resp);
    })
    .catch((e) => {
      getError(e, res);
    });
};

const destroy = (req, res) => {
  User.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((resp) => {
      if (resp === 1) {
        res.status(200).json({ message: "Deleted successfully" });
      } else {
        res.status(400).json({ errors: ["Record not found"] });
      }
    })
    .catch((e) => {
      getError(e, res);
    });
};

const rawQuery = async (req, res) => {
  const data = await db.sequelize.query(
    "SELECT * from users where name=:name",
    {
      type: QueryTypes.SELECT,
      //   model: User,
      //   mapToModel: true,
      //   raw: true,
      replacements: { name: "saransh" },
    }
  );
  res.status(200).json(data);
};

module.exports = {
  save,
  update,
  findById,
  findByParam,
  findAll,
  destroy,
  rawQuery,
};
