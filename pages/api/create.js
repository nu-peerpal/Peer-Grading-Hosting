const db = require("../../models/index.js");
const Enrollment = db.enrollment;
const Announcements = db.announcements;
const Assignment = db.assignments;
const Course = db.course;
const Op = db.Sequelize.Op;
const Rubric = db.rubrics;
//this api is to populate the database!
export default (req, res) => {
  return new Promise((resolve) => {
    switch (req.method) {
      case "GET":
        res.send("Hello World!");
        break;
      case "POST":
        const rubric = {
          rubric: { cat1: "please report how this student did in Y category" },
        };
        // Create assignments
        const assignment = {
          assignmentDueDate: "2012-8-28",
          name: "Course 2, Assignment 2: LTI Implementation",
          canvasId: "random_canvas_string2",
          peerreviewDueDate: "2012-10-28",
          appealsDueDate: "2012-12-30",
          courseId: 2,
          reviewrubricId: 3,
          rubricId: 2,
        };

        // Rubric.create(rubric)
        //   .then((data) => {
        //     res.send(data);
        //     res.json(data);
        //     resolve();
        //   })
        //   .catch((err) => {
        //     res.status(500).send({
        //       message:
        //         err.message ||
        //         "Some error occurred while creating the enrollment.",
        //     });
        //   });

        // Save enrollment in the database
        Assignment.create(assignment)
          .then((data) => {
            res.send(data);
            res.json(data);
            resolve();
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while creating the enrollment.",
            });
          });
        break;
    }
  });
};
