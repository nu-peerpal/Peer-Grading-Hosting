import {
  assignments,
  peer_review_status,
  assignment_submissions,
  review_grades,
  submission_grades,
  groups,
} from "../../../models/index.js";

const db = require("../../../models/index.js");
const Op = db.Sequelize.Op;
// this route gives all graded assignments, both peer reviews and assignments

export default (req, res) => {
  return new Promise((resolve) => {
    switch (req.method) {
      case "GET":
        db.assignments
          .findAll({
            include: [
              {
                model: peer_review_status,
                where: { status: 8 },
                attributes: [],
              },
              {
                model: review_grades,
                where: { userId: req.query.userId },
                attributes: ["grade"],
              },
            ],
            where: {
              courseId: req.query.courseId,
            },
            attributes: ["name", "id"],
          })
          .then((result) => {
            db.users
              .findOne({
                where: { id: req.query.userId },
                attributes: [],
                include: [
                  {
                    model: groups,
                    through: {
                      where: { userId: req.query.userId },
                    },
                    attributes: ["id"],
                    include: [
                      {
                        model: assignment_submissions,
                        attributes: ["id"],
                        include: [
                          {
                            model: assignments,
                            where: {
                              courseId: req.query.courseId,
                              graded: true,
                            },
                            attributes: ["name"],
                          },
                          {
                            model: submission_grades,
                            attributes: ["grade"],
                          },
                        ],
                      },
                    ],
                  },
                ],
              })
              .then((result2) => {
                res.json({
                  Graded_Peer_Reviews: result,
                  Grade_Assignments: result2.get({ plain: true }).groups[0]
                    .assignment_submissions,
                });
                resolve();
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
