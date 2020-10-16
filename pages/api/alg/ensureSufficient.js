import { assignments, review_grades } from "../../../models/index.js";

const db = require("../../../models/index.js");
const Op = db.Sequelize.Op;
export default (req, res) => {
  return new Promise((resolve) => {
    switch (req.method) {
      case "GET":
        db.users
          .findAll({
            attributes: ["id"],
            where: {
              enrollment: "ta",
              courseId: req.query.courseId,
            },
          })
          .then((ta) => {
            db.peer_matchings
              .findAll({
                attributes: ["submissionId", "userId", "review"],
                where: {
                  assignmentId: req.query.assignmentId,
                },
              })
              .then((reviews) => {
                db.peer_matchings
                  .findAll({
                    attributes: ["userId", "submissionId"],
                    where: {
                      assignmentId: req.query.assignmentId,
                    },
                  })
                  .then((matchings) => {
                    res.json({
                      Graders: ta,
                      Reviews: reviews,
                      Matchings: matchings,
                    });
                    resolve();
                  });
              });
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while retrieving the peerMatching requirements.",
            });
          });
        break;
      case "POST":
        resolve();
        break;

      default:
        res.status(405).end(); //Method Not Allowed
        return resolve();
        break;
    }
  });
};
