const db = require("../../../models/index.js");
const Assignments = db.assignments;
const Assignment_Submission = db.assignment_submission;
const Peer_Matching = db.peer_matching;
const Op = db.Sequelize.Op;

//this route will return a specific peer review
export default (req, res) => {
  switch (req.method) {
    case "GET":
      db.peer_matching
        .findAll({
          attributes: ["announcement"],
          where: {
            userId: req.params.userId,
          },
        })
        .then((result) => res.json(result));
      break;
    //case "POST":
    /* if (!req.body) {
        res.status(400).send({
          message: "Content can not be empty!",
        });
        break;
      }
      // Create an announcement
      const announcement = {
        announcement: req.body.announcement,
        courseId: req.params.courseId,
      };
      // Save enrollment in the database
      Announcement.create(announcement)
        .then((data) => {
          res.send(data);
          res.json(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while creating the announcement.",
          });
        });

      break; */
    default:
      res.status(405).end(); //Method Not Allowed
      break;
  }
};
