const db = require("../../../models/index.js");
const responseHandler = require("../utils/responseHandler");
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async (req, res) => {
  try {
    let group_enrollment = await db.group_enrollments.findByPk(req.query.id);
    switch (req.method) {
      case "GET":
        responseHandler.response200(res, group_enrollment);
        break;
      case "PATCH":
        for (const property in req.body) {
          group_enrollment[property] = req.body[property];
        }
        await assignment.save();
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
