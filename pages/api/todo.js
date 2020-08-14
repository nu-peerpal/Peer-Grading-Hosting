const db = require("../../models/index.js");
const Op = db.Sequelize.Op;
//this route gives PR assignments that haven’t passed for that course and student

export default (req, res) => {
  return new Promise((resolve) => {
    switch (req.method) {
      case "GET":
        // var dateParam = new Date('3/20/19 0:21:22 PM +00:00')
        console.log(db.sequelize.fn("currdate"));
        db.assignments
          .findAll({
            where: {
              courseId: req.query.courseId,
              peerreviewDueDate: { $lt: db.sequelize.fn("currdate") },
            },
            attributes: ["id"],
          })
          .then((results) => {
            var ids = results.map((result) => result.id);
            db.peer_matchings
              .findAll({
                where: {
                  assignmentId: ids,
                  userId: req.query.userId,
                },
                //add date
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
