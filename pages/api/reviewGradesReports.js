const db = require("../../../models/index.js");
const responseHandler = require("../utils/responseHandler");
const includeExcludeProps = require("../utils/includeExcludeProps");

export default async (req, res) => {
  try {
    switch (req.method) {
      case "GET":
        if (!req.query.userId) {
          throw new Error("Query parameter userId required");
        }
        const params = { userId: req.query.userId };
        if (req.query.assignmentId) {
          params.assignmentId = req.query.assignmentId;
        }
        let reviewGradesReports = await db.review_grades_reports.findAll({
          where: params,
        });
        reviewGradesReports = reviewGradesReports.map((gradeReport) =>
          includeExcludeProps(req, gradeReport)
        );
        responseHandler.response200(reviewGradesReports);
        break;

      case "POST":
        if (req.query.type === "multiple") {
          await Promise.all(
            req.body.map((gradeReport) =>
              db.review_grades_reports.create(gradeReport)
            )
          );
        } else {
          await db.review_grades_reports.create(req.body);
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
