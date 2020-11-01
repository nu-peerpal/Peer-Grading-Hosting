const db = require("../../../models/index.js");
const responseHandler = require("../utils/responseHandler");
const includeExcludeProps = require("../utils/includeExcludeProps");

export default async (req, res) => {
  try {
    let rubric = await db.rubrics.findByPk(req.query.id);
    switch (req.method) {
      case "GET":
        submission = includeExcludeProps(req, rubric);
        responseHandler.response200(res, rubric);
        break;
      default:
        throw new Error("Invalid HTTP method");
    }
  } catch (err) {
    responseHandler.response400(res, err);
  }
};
