const db = require("../../models/index.js");
const Enrollment = db.enrollment;
const Announcements = db.announcements;
const Assignment = db.assignment;
const Course = db.course;
const Op = db.Sequelize.Op;
//this api is to populate the db
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
        enrollment_type: "ta",
        courseId: 1,
      };
      const announcement = {
        courseId: 1,
        announcement: "yet another Course 1 announcement",
      };
      const course = {
        active: false,
        canvas_id: "jjssa",
        course_name: "second course",
      };

      const assignment = {
        name: "third assignment: course #1",
        canvas_id: "jj99jj",
        courseId: 1,
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
      // Course.create(course)
      //   .then((data) => {
      //     res.send(data);
      //     res.json(data);
      //   })
      //   .catch((err) => {
      //     res.status(500).send({
      //       message:
      //         err.message || "Some error occurred while creating the course.",
      //     });
      //   });
      Announcements.create(announcement)
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
      Assignment.create(assignment)
        .then((data) => {
          res.send(data);
          res.json(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while creating the assignment.",
          });
        });

      break;
    default:
      res.status(405).end(); //Method Not Allowed
      break;
  }
};
