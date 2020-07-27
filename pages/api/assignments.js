const db = require("../../models/index.js");
const Assignment = db.assignment;
const Course = db.course;
const Op = db.Sequelize.Op;

//this route will return an array of assignment objects based on course
export default (req, res) => {
  switch (req.method) {
    case "GET":
      db.assignment
        .findAll({
          // if we wanted only specific attributes
          // attributes: ["courseId"],
          where: {
            courseId: req.params.courseId,
          },
        })
        .then((result) => res.json(result));
      break;
    case "POST":

    default:
      res.status(405).end(); //Method Not Allowed
      break;
  }
};
