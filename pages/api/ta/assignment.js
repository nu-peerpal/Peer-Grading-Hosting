import { peer_review_status } from "../../../models/index.js";

const db = require("../../../models/index.js");
const Op = db.Sequelize.Op;

//this route will return an array of announcement strings based on courseId
export default (req, res) => {
  return new Promise((resolve) => {
    switch (req.method) {
      case "GET":
        db.assignments
          .findAll({
            include: [
              {
                model: peer_review_status,
                where: { status: 10 },
                attributes: ["status"],
              },
            ],
            where: {
              courseId: req.query.courseId,
            },
          })
          .then((result) => {
            db.assignments
              .findAll({
                include: [
                  {
                    model: peer_review_status,
                    where: { status: { [Op.not]: 10 } },
                    attributes: ["status"],
                  },
                ],
                where: {
                  courseId: req.query.courseId,
                },
              })
              .then((result2) => {
                res.json({ Completed: result, Current: result2 });
                resolve();
              });
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
