const db = require("../../../models/index.js");
const responseHandler = require("../utils/responseHandler");
const includeExcludeProps = require("../utils/includeExcludeProps");

export default async (req, res) => {
  try {
    let assignment = await db.assignments.findByPk(req.query.id);
    switch (req.method) {
      case "GET":
        assignment = includeExcludeProps(req, assignment);
        responseHandler.response200(assignment);
        break;
      case "PATCH":
        for (const property in req.body) {
          assignment[property] = req.body[property];
        }
        await assignment.save();
        responseHandler.msgResponse200("Successfully updated database entry.");
        break;
      default:
        throw new Error("Invalid HTTP method");
    }
  } catch (err) {
    responseHandler.response400(res, err);
  }
};
