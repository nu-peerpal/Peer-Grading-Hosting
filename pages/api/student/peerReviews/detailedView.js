const db = require("../../../models/index.js");
const exHandler = require("../utils/exHandler");
//this route gives PR assignments that haven’t passed for that course and student

export default async (req, res) => {
  try {
    switch (req.method) {
      case "GET":
        const submissions = await db.assignment_submissions.findAll({
          attributes: ["s3Link"],
          where: { id: req.query.submissionId },
        });
        const rubrics = await db.rubrics.findAll({
          where: { id: req.query.rubricId },
          attributes: ["rubric"],
        });
        res.json({ SubmissionData: submissions, RubricData: rubrics });
        break;
      case "POST":
        //console.log('whats wrong', req.query.id)
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
          .then((result) => res.json(result))
          .catch((err) => {
            res.status(500).send({
              message: err.message,
            });
          });
        break;
      default:
        res.status(405).end();
    }
  } catch (err) {
    exHandler.response500(res, err);
  }
};

export default Name;
