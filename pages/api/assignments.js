const db = require("../../models/index.js");
const Assignments = db.assignments;
const Courses = db.courses;
const Op = db.Sequelize.Op;

//this route will return an array of assignment objects based on course
export default (req, res) => {
  switch (req.method) {
    case "GET":
      db.assignments
        .findAll({
          // if we wanted only specific attributes
          // attributes: ["courseId"],
          where: {
            courseId: req.query.courseId,
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
