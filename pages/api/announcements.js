const db = require("../../models");
const responseHandler = require("./utils/responseHandler");

//this route will return an array of announcement strings based on courseId
const announcementsHandler = async (req, res) => {
  try {
    switch (req.method) {
      case "GET":
        if (!req.query.courseId) {
          throw new Error("Query parameter courseId required");
        }
        let announcements = await db.announcements.findAll({
          where: { courseId: req.query.courseId },
        });
        responseHandler.response200(res, announcements);
        break;

      case "POST":
        if (req.query.type === "multiple") {
          await Promise.all(
            req.body.map(announcement => db.announcements.create(announcement)),
          );
        } else {
          await db.announcements.create(req.body);
        }
        responseHandler.msgResponse201(
          res,
          "Successfully created database entries.",
        );
        break;

      default:
        throw new Error("Invalid HTTP method");
    }
  } catch (err) {
    responseHandler.response400(res, err);
  }
};

export default announcementsHandler;
