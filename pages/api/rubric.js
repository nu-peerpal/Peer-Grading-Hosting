const db = require("../../models/index.js");
const Op = db.Sequelize.Op;

//this route will return an array of announcement strings based on courseId
export default (req, res) => {
  return new Promise((resolve) => {
    switch (req.method) {
      case "GET":
        db.rubrics
          .findOne({
            attributes: ["rubric"],
            where: {
              id: req.query.id,
            },
          })
          .then((result) => {
            res.json(result);
            resolve();
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while retrieving the rubric.",
            });
          });
        break;
      default:
        res.status(405).end(); //Method Not Allowed
        return resolve();
        break;
    }
  });
};
