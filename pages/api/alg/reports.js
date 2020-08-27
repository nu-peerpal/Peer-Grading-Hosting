import { assignments, review_grades, rubrics } from "../../../models/index.js";
const db = require("../../../models/index.js");
const Submission_Report = db.submission_report;
const Submission_Grades = db.submission_grades;
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
                db.assignments
                  .findOne({
                    where: {
                      id: req.query.assignmentId,
                    },
                    include: [
                      {
                        model: rubrics,
                        attributes: ["rubric"],
                      },
                    ],
                    attributes: [],
                  })
                  .then((rubric) => {
                    res.json({
                      Graders: ta,
                      Reviews: reviews,
                      Rubric: rubric,
                    });
                    resolve();
                  });
              });
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while retrieving the submissionReport requirements.",
            });
          });
        break;
      case "POST":
        if (req.query.type == 1) {
          var grades = req.body.review_grades;
          grades.map((g) => {
            const grade = {
              userId: g[0],
              grade: g[1],
              assignmentId: req.query.assignmentId,
            };
            db.review_grades.create(grade).catch((err) => {
              res.status(500).send({
                message:
                  err.message ||
                  "Some error occurred while updating review grades table.",
              });
            });
          });
          var reports = req.body.review_reports;
          reports.map((g) => {
            const report = {
              userId: g[0],
              assignmentId: req.query.assignmentId,
              report: { reportBody: g[2] },
            };
            db.review_reports.create(report).catch((err) => {
              res.status(500).send({
                message:
                  err.message ||
                  "Some error occurred while updating the review reports table",
              });
            });
          });
        } else {
          var grades = req.body.submission_grades;
          grades.map((g) => {
            const grade = {
              assignmentSubmissionId: g[0],
              grade: g[1],
            };
            db.submission_grades.create(grade).catch((err) => {
              res.status(500).send({
                message:
                  err.message ||
                  "Some error occurred while updating submission grades table.",
              });
            });
          });
          var reports = req.body.submission_reports;
          reports.map((g) => {
            const report = {
              assignmentSubmissionId: g[0],
              report: { reportBody: g[1] },
            };
            db.submission_reports.create(report).catch((err) => {
              res.status(500).send({
                message:
                  err.message ||
                  "Some error occurred while updating the submission reports table",
              });
            });
          });
        }

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
