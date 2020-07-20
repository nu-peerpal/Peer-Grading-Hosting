module.exports = (app) => {
  //controllers are functions that set index tables
  const enrollments = require("../../controllers/Enrollment.controller.js");

  var router = require("express").Router();

  // Create a new Enrollment
  router.post("/", enrollments.create);

  // Retrieve all Enrollments
  router.get("/", enrollments.findAll);

  // Retrieve all published Enrollments
  router.get("/published", enrollments.findAllPublished);

  // Retrieve a single Enrollments with id
  router.get("/:id", enrollments.findOne);

  // Update a Enrollments with id
  router.put("/:id", enrollments.update);

  // Delete a Enrollment with id
  router.delete("/:id", enrollments.delete);

  // Create an enrollment
  router.delete("/", enrollments.deleteAll);

  //app.use("/api/enrollments", router);
};
