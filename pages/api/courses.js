const db = require("../../models");
const responseHandler = require("./utils/responseHandler");

export default async (req, res) => {
  try {
    switch (req.method) {
      case "GET":
        if (!req.query.canvasId) {
          throw new Error("Query parameter canvasId required");
        }
        let courses = await db.courses.findAll({
          where: { canvasId: req.query.canvasId },
        });
        responseHandler.response200(res, courses);
        break;
      case "POST":
        if (req.query.type === "multiple") {
          await Promise.all(
            req.body.map((course) => db.courses.create(course))
          );
        } else {
          await db.courses.create(req.body);
        }
        responseHandler.msgResponse201(
          res,
          "Successfully created database entries."
        );
        break;

      default:
        throw new Error("Invalid HTTP method");
    }
  } catch (err) {
    responseHandler.response400(res, err);
  }
};
