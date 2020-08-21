import {
  assignments,
  peer_review_status,
  assignment_submissions,
  review_grades,
  submission_grades,
  groups,
  submission_reports,
} from "../../../../models/index.js";

const db = require("../../../../models/index.js");
const Op = db.Sequelize.Op;
// this route returns submission report for specific assignment
// called with ID returned in the /all call

export default (req, res) => {
  return new Promise((resolve) => {
    switch (req.method) {
      case "GET":
        db.assignment_submissions
          .findOne({
            attributes: ["s3Link"],
            where: { id: req.query.id },
            include: [
              {
                model: submission_reports,
                attributes: ["report"],
              },
              {
                model: assignments,
                attributes: ["assignmentDueDate", "name", "appealsDueDate"],
              },
            ],
          })
          .then((result) => {
            res.json(result);
            resolve();
          });
        break;
      default:
        res.status(405).end(); //Method Not Allowed
        return resolve();
        break;
    }
  });
};
