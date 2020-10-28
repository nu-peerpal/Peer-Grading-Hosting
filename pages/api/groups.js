const db = require("../../models");
const responseHandler = require("./utils/responseHandler");
const includeExcludeProps = require("./utils/includeExcludeProps");

export default async (req, res) => {
  try {
    switch (req.method) {
      case "GET":
        if (!req.query.assignmentId) {
          throw new Error("Query parameter assignmentId required");
        }
        let groups = await db.groups.findAll({
          where: { courseId: req.query.assignmentId },
          include: {
            model: db.group_enrollments,
            attributes: ["userId"],
          },
        });
        groups = groups.map((group) => includeExcludeProps(req, group));
        responseHandler.response200(res, groups);
        break;
      default:
        throw new Error("Invalid HTTP method");
    }
  } catch (err) {
    responseHandler.response400(res, err);
  }
};
