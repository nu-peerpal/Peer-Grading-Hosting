const db = require("../../../models/index.js");
const Op = db.Sequelize.Op;
// this route returns review report for specific peer review
// called with ID returned in the /all call

export default (req, res) => {
  return new Promise((resolve) => {
    switch (req.method) {
      case "GET":
        db.review_reports
          .findOne({
            attributes: ["report"],
            where: {
              assignmentId: req.query.assignmentId,
              userId: req.query.userId,
            },
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
