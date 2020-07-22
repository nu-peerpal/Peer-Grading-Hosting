// import nc from "next-connect";
// const nc = require("next-connect");

// const handler = nc()
//   .use("/api/enrollments", fn)
//   .get((req, res) => {
//     res.send("Hello world");
//   })
//   .post((req, res) => {
//     res.json({ hello: "world" });
//   })
//   .put(async (req, res) => {
//     res.end("async/await is also supported!");
//   })
//   .patch(async (req, res) => {
//     throw new Error("Throws me around! Error can be caught and handled.");
//   });

// module.exports = handler;
//export default handler;

// module.exports = (app) => {

//   //controllers are functions that set index tables
//   const enrollments = require("../../controllers/enrollment.controller.js");

//   var router = require("express").Router();

//   // Create a new Enrollment
//   router.post("/", enrollments.create);

//   // Retrieve all Enrollments
//   router.get("/", enrollments.findAll);

//   // Retrieve all published Enrollments
//   router.get("/published", enrollments.findAllPublished);

//   // Retrieve a single Enrollments with id
//   router.get("/:id", enrollments.findOne);

//   // Update a Enrollments with id
//   router.put("/:id", enrollments.update);

//   // Delete a Enrollment with id
//   router.delete("/:id", enrollments.delete);

//   // Create an enrollment
//   router.delete("/", enrollments.deleteAll);

//   app.use("/api/enrollments", router);
// };

// // req = request data, res = response data
// module.exports = (req, res) => {
//   res.status(200).json({ text: "Hello" });
// };
