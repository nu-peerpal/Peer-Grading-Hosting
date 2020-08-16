import {
  assignments,
  peer_review_status,
  assignment_submissions,
} from "../../models/index.js";

const db = require("../../models/index.js");
const Op = db.Sequelize.Op;
//this route gives PR assignments that haven’t passed for that course and student

export default (req, res) => {
  return new Promise((resolve) => {
    switch (req.method) {
      case "GET":
        // for all assignments that graded boolean is true within the courseId
        // fetch the assignment name and the grades associate with submissions
        // based on userId
        // assignmentSubmissionId based on userId and courseId
        db.assignments
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
                  graded: true,
                },
                required: true,
                attributes: ["name", "peerreviewDueDate"],
              },
            ],
            where: {
              graded: req.query.userId,
            },
            //add date
          })
          .then((result) => {
            res.json(result);
            resolve();
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
