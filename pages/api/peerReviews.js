import { assignments } from "../../models/index.js";

const db = require("../../models/index.js");
const Op = db.Sequelize.Op;
//this route gives PR assignments that haven’t passed for that course and student

export default (req, res) => {
  return new Promise((resolve) => {
    switch (req.method) {
      case "GET":
        var curr = db.Sequelize.literal("NOW()");
        if (req.query.current == 0) {
          curr = db.Sequelize.literal("NOW() - INTERVAL '365d'");
        }
        db.peer_matchings
          .findAll({
            include: [
              {
                model: assignments,
                where: {
                  courseId: req.query.courseId,
                  peerreviewDueDate: {
                    [Op.gte]: curr,
                  },
                },
                required: true,
                attributes: ["name", "peerreviewDueDate"],
              },
            ],
            where: {
              userId: req.query.userId,
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
