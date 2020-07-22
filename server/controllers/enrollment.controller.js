const db = require("../models");
const Enrollment = db.enrollment;
const Op = db.Sequelize.Op;

// Create and Save new enrollment information
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create an enrollment
  const enrollment = {
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false
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

// Retrieve all enrollments from database
exports.findAll = (req, res) => {
  console.log('find all found')
  const title = req.query.title;
  var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

  Enrollment.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Enrollments.",
      });
    });
};

// Find a single enrollment with id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Enrollment.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Enrollment with id=" + id,
      });
    });
};

// Update an enrollment by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Enrollment.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Enrollment was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Enrollment with id=${id}. Maybe Enrollment was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Enrollment with id=" + id,
      });
    });
};

// Delete an enrollment with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Enrollment.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Enrollment was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Enrollment with id=${id}. Maybe Enrollment was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Enrollment with id=" + id,
      });
    });
};

// Delete all enrollments from the database.
exports.deleteAll = (req, res) => {
  Enrollment.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Enrollments were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Enrollments.",
      });
    });
};

// Find all enrollments with a certain conditions
exports.findAllPublished = (req, res) => {
  Enrollment.findAll({ where: { published: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Enrollments.",
      });
    });
};
