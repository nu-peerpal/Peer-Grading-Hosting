const db = require("../../models/index.js");
const Announcements = db.announcements;
const Op = db.Sequelize.Op;

//this route will return an array of announcement strings based on courseId
export default (req, res) => {
  switch (req.method) {
    case "GET":
      //console.log("hi", req.query);
      db.announcements
        .findAll({
          attributes: ["announcement"],
          where: {
            courseId: req.query.courseId,
          },
        })
        .then((result) => {
          console.log(result) 
          res.json(result)});
        // console.log(result)
      break;
    default:
      res.status(405).end(); //Method Not Allowed
      break;
  }
};
