const db = require("../../../../models/index.js");
const Op = db.Sequelize.Op;

export default (req, res) => {
  return new Promise((resolve) => {
    switch (req.method) {
      case "GET":
        db.assignment_submissions
          .findAll({
            attributes: ["s3Link"],
            where: {
              id: req.query.submissionId,
            },
          })
          .then((result) => {
            db.rubrics
              .findAll({
                where: {
                  id: req.query.rubricId,
                },
                attributes: ["rubric"],
              })
              .then((result2) => {
                res.json({ SubmissionData: result, RubricData: result2 });
                resolve();
              });
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while retrieving the submission.",
            });
          });
        break;
      case "POST":
        db.peer_matchings
          .update(
            {
              review: req.body,
            },
            {
              where: { id: req.query.id },
              returning: true,
              plain: true,
            }
          )
          .then(function (result) {
            resolve();
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message || "Some error occurred.",
            });
          });
      default:
        res.status(405).end(); //Method Not Allowed
        return resolve();
        break;
    }
  });
};
