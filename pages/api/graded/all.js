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
                attributes: ["groupId"],
              })
              .then((result2) => {
                var r = result2.get().groupId;
                console.log(r);
                db.groups
                  //need to re-do now that users have group affilitation--> will have group information passed?
                  .findOne({
                    where: { id: r },
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
                  })
                  .then((result3) => {
                    res.json({
                      Graded_Peer_Reviews: result,
                      Graded_Assignments: result3.get({ plain: true })
                        .assignment_submissions,
                    });
                    resolve();
                  });
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
