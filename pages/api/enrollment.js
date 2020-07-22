const db = require("../../server/models");
const Enrollment = db.enrollment;
const Op = db.Sequelize.Op;

export default (req, res) => {
  // Validate request
  if (!req.body.title) {
    console.log(req);
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  // Create an enrollment
  const enrollment = {
    title: req.body.title,
    description: req.body.description,
    // published: req.body.published ? req.body.published : false
  };
  // Save enrollment in the database
  Enrollment.create(enrollment)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the enrollment.",
      });
    });
};
