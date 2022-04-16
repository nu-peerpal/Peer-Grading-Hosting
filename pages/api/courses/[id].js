const db = require("../../../models/index.js");
const responseHandler = require("../utils/responseHandler");

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async (req, res) => {
  try {
    let course = await db.courses.findByPk(req.query.id);
    switch (req.method) {
      case "GET":
        responseHandler.response200(res, course);
        break;
      case "PATCH":
        console.log(req.body);
        for (const property in req.body) {
          course[property] = req.body[property];
        }
        await course.save();
        responseHandler.msgResponse200(
          res,
          "Successfully updated database entry.",
        );
        break;
      default:
        throw new Error("Invalid HTTP method");
    }
  } catch (err) {
    responseHandler.response400(res, err);
  }

};
