module.exports = app => {
    const enrollments = require("../controllers/enrollment.controller");
  
    var router = require("express").Router();
  
    // Create a new Enrollment
    router.post("/", enrollments.create);
  
    // Retrieve all Tutorials
    router.get("/", enrollments.findAll);
  
    // Retrieve all published Tutorials
    router.get("/published", enrollments.findAllPublished);
  
    // Retrieve a single Enrollment with id
    router.get("/:id", enrollments.findOne);
  
    // Update a Enrollment with id
    router.put("/:id", enrollments.update);
  
    // Delete a Enrollment with id
    router.delete("/:id", enrollments.delete);
  
    // Create a new Enrollment
    router.delete("/", enrollments.deleteAll);
  
    app.use('/api/enrollments', router);
  };