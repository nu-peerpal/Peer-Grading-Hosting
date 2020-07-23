import { course } from "../../models/index.js";

const db = require("../../models/index.js");
const Enrollment = db.enrollment;
const Course = db.course;
const Op = db.Sequelize.Op;

const holder_arr = [];
export default (req, res) => {
  switch (req.method) {
    case "GET":
      // getting the courseID of all Courses with enrollmenttype = student
      if (req.body.q_type == "courseId") {
        db.enrollment
          .findAll({
            attributes: ["courseId"],
            where: {
              enrollment_type: "student",
            },
          })
          .then((result) => res.json(result));
        break;
      } else {
        db.enrollment
          .findByPk(req.params.courseID)
          .then((result) => res.json(result));

        break;
      }

    case "POST":
      if (!req.body) {
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

      break;
    default:
      res.status(405).end(); //Method Not Allowed
      break;
  }
};
