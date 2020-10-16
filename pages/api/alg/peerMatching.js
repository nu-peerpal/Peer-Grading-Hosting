import { assignments, review_grades } from "../../../models/index.js";

const db = require("../../../models/index.js");
const Op = db.Sequelize.Op;
// peer matching algorithm
// requires:
// - submissions&groupId who submitted it & users in that group
// - students in course & ta's in course
export default (req, res) => {
  return new Promise((resolve) => {
    switch (req.method) {
      case "GET":
        db.users
          .findAll({
            attributes: ["id", "groupId"],
            where: {
              enrollment: "student",
              courseId: req.query.courseId,
            },
          })
          .then((students) => {
            db.users
              .findAll({
                attributes: ["id"],
                where: {
                  enrollment: "ta",
                  courseId: req.query.courseId,
                },
              })
              .then((ta) => {
                db.assignment_submissions
                  .findAll({
                    attributes: ["id", "groupId"],
                    where: {
                      assignmentId: req.query.assignmentId,
                    },
                  })
                  .then((submissions) => {
                    res.json({
                      Peers: students,
                      Graders: ta,
                      Submissions: submissions,
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
        // post must take the matchings outputted and store with correct assignmentId
        //  & peerMatching with match type specificed in query
        var pm = req.body.peer_matchings;
        pm.map((g) => {
          const matching = {
            submissionId: g[1],
            userId: g[0],
            matchingType: req.query.type,
            assignmentId: req.query.assignmentId,
          };
          db.peer_matchings.create(matching).catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while updating peer matching table.",
            });
          });
        });
        res.status(500).send({ message: "post request complete" });
        res.end();
        resolve();
        break;
      default:
        res.status(405).end(); //Method Not Allowed
        return resolve();
        break;
    }
  });
};
