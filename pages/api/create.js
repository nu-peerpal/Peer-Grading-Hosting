import { review_reports } from "../../models/index.js";

const db = require("../../models/index.js");
const Enrollment = db.enrollment;
const Announcements = db.announcements;
const Peer_Review_Status = db.peer_review_status;
const Assignments = db.assignments;
const Users = db.users;
const Groups = db.groups;
const Review_Reports = db.review_reports;
const Submission_Report = db.submission_reports;
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
        const review_report = {
          report: {
            assignmentId: 2,
            userId: 1,
            reportBody:
              '# Review Report (Grade: 100)\n\n<submission id="111" />\n\n|        Rubric        |  TA Scores [[?]][1]  | Your Scores [[?]][2] |\n| :------------------: | :------------------: | :------------------: | \n|       Content        |      6 [[?]][3]      |      6 [[?]][4]      |\n|   Writing Quality    |      4 [[?]][5]      |      4 [[?]][6]      |\n\n[1]: # "T\n​\n​r\n​\n​y\n​\n​ \n​\n​h\n​\n​a\n​\n​r\n​\n​d\n​\n​e\n​\n​r"\n[2]: # "T\n​\n​r\n​\n​y\n​\n​ \n​\n​h\n​\n​a\n​\n​r\n​\n​d\n​\n​e\n​\n​r"\n[3]: # "okay"\n[4]: # "okay"\n[5]: # "bad"\n[6]: # "bad"',
          },
        };
        // Create assignments
        const assignment = {
          assignmentDueDate: "2019-8-28",
          name: "Course 2, Assignment 3: LTI Testing",
          canvasId: "random_canvas_string2",
          peerreviewDueDate: "2019-10-28",
          appealsDueDate: "2019-12-30",
          courseId: 2,
          reviewrubricId: 1,
          rubricId: 1,
          grade: true,
        };
        const user = {
          canvasId: "gg",
          lastName: "gry",
          firstName: "dylan",
          courseId: 1,
          enrollment: "ta",
        };

        const prs = {
          status: 1,
          assignmentId: 1,
        };
        const pr = {
          matchingType: "initial",
          userId: 1,
          assignmentId: 2,
          submissionId: 2,
        };

        const submission = {
          s3Link: "www.google.com/hehe",
          canvasId: "www.yahoo.com/news",
          groupId: 2,
          assignmentId: 2,
        };

        const group = {
          assignmentId: 1,
          canvasId: "group2",
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
        Users.create(user)
          .then((data) => {
            res.send(data);
            //res.json(data);
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
