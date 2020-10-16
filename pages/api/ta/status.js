const db = require("../../../models/index.js");
const Op = db.Sequelize.Op;
const Peer_Review_Status = db.peer_review_status;

export default (req, res) => {
  return new Promise((resolve) => {
    switch (req.method) {
      case "GET":
        db.peer_review_status
          .findAll({
            limit: 1,
            order: [["createdAt", "DESC"]],
            attributes: ["status"],
            where: {
              assignmentId: req.query.assignmentId,
            },
          })
          .then((result) => {
            res.json(result);
            resolve();
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while retrieving the rubric.",
            });
          });
        break;
      case "POST":
        const prs = {
          status: req.query.status,
          assignmentId: req.query.assignmentId,
        };
        db.peer_review_status
          .create(prs)
          .then((data) => {
            res.send(data);
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
