import {
  assignments,
  peer_review_status,
  assignment_submissions,
  review_grades,
  submission_grades,
  groups,
  submission_reports,
} from "../../../models/index.js";

const db = require("../../../models/index");
const Op = db.Sequelize.Op;
//this route gives PR assignments that haven’t passed for that course and student

export default (req, res) => {
  return new Promise((resolve) => {
    switch (req.method) {
      case "GET":
        var curr = db.Sequelize.literal("NOW()");
        db.peer_matchings
          .findAll({
            include: [
              {
                model: assignments,
                include: [
                  {
                    model: peer_review_status,
                    attributes: ["status"],
                  },
                ],
                where: {
                  courseId: req.query.courseId,
                  peerreviewDueDate: {
                    [Op.gte]: curr,
                  },
                },
                required: true,
                attributes: [
                  "name",
                  "peerreviewDueDate",
                  "rubricId",
                  "reviewrubricId",
                ],
              },
            ],
            where: {
              userId: req.query.userId,
            },
            attributes: [
              "id",
              "review",
              "matchingType",
              "createdAt",
              "assignmentId",
              "submissionId",
            ],
          })
          .then((result) => {
            db.assignments
              .findAll({
                where: {
                  courseId: req.query.courseId,
                },
                include: [
                  {
                    model: peer_review_status,
                    attributes: ["status"],
                  },
                ],
              })
              .then((result2) => {
                res.json({ Peer_Review_ToDo: result, Status_Updates: result2 });
                resolve();
              });
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while retrieving the peer matchings.",
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
