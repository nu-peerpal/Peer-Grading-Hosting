const db = require("../../../models/index.js");
const Op = db.Sequelize.Op;
const responseHandler = require("../utils/responseHandler");
const includeExcludeProps = require("../utils/includeExcludeProps");

export default async (req, res) => {
  try {
    switch (req.method) {
      case "GET":
        if (!req.query.courseId) {
          throw new Error("Query parameter courseId required");
        }
        const params = { courseId: req.query.courseId };

        if (req.query.minReviewDueDate) {
          params.reviewDueDate = {
            [Op.gte]: new Date(req.query.minReviewDueDate),
          };
        }
        if (req.query.graded === "true") {
          params.graded = true;
        }

        let assignments = await db.assignments.findAll({ where: params });
        assignments = assignments.map((assignment) =>
          includeExcludeProps(req, assignment)
        );
        responseHandler.response200(assignments);
        break;
      default:
        throw new Error("Invalid HTTP method");
    }
  } catch (err) {
    responseHandler.response400(res, err);
  }
};
