const db = require("../../models/index.js");
const Announcements = db.announcements;
const Op = db.Sequelize.Op;

//this route will return an array of announcement strings based on courseId
export default (req, res) => {
  return new Promise((resolve) => {
    switch (req.method) {
      case "GET":
        console.log("got it");
        db.announcements
          .findAll({
            attributes: ["announcement"],
            where: {
              courseId: req.query.courseId,
            },
          })
          .then((result) => {
            res.json(result);
            resolve();
          });
        break;
      default:
        res.status(405).end(); //Method Not Allowed
        return resolve();
        break;
    }
  });
};
