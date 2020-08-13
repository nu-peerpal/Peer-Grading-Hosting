const db = require("../../models/index.js");
const Op = db.Sequelize.Op;

//this route will return an array of announcement strings based on courseId
export default (req, res) => {
  return new Promise((resolve) => {
    switch (req.method) {
      case "GET":
        var type = 0;
        if (req.query.type == 1) {
          type = "rubricId";
        } else {
          type = "reviewrubricId";
        }
        console.log(type);
        db.assignments
          .findOne({
            attributes: [type],
            where: {
              courseId: req.query.courseId,
              id: req.query.assignmentId,
            },
          })
          .then((result) => {
            if (type == "rubricId") {
              var rubric = result.get().rubricId;
            } else {
              var rubric = result.get().reviewrubricId;
            }

            db.rubrics
              .findOne({
                attributes: ["rubric"],
                where: {
                  id: rubric,
                },
              })
              .then((result) => {
                res.json(result);
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
