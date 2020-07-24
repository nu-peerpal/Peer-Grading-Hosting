const db = require("../../models/index");
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
          //attributes: ["courseId"],
          where: {
            courseId: req.params.courseId,
          },
        })
        .then((result) => res.json(result));
      break;
    case "POST":
    /* if (!req.body) {
        res.status(400).send({
          message: "Content can not be empty!",
        });
        break;
      }
      // Create an enrollment
      const enrollment = {
        enrollment_type: req.body.enrollment_type,
        courseId: req.params.courseId,
      };
      // Save enrollment in the database
      Enrollment.create(enrollment)
        .then((data) => {
          res.send(data);
          res.json(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while creating the enrollment.",
          });
        });

      break; */
    default:
      res.status(405).end(); //Method Not Allowed
      break;
  }
};
