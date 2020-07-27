const db = require("../../models/index.js");
const Announcements = db.announcements;
const Op = db.Sequelize.Op;

//this route will return an array of announcement strings based on courseId
export default (req, res) => {
  switch (req.method) {
    case "GET":
      db.announcements
        .findAll({
          attributes: ["announcement"],
          where: {
            courseId: 1, //req.params.courseId,
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
