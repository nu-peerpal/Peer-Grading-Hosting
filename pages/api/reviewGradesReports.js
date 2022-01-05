const db = require("../../models/index.js");
const responseHandler = require("./utils/responseHandler");
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async (req, res) => {
  try {
    switch (req.method) {
      case "GET":
        let params = {};
        if (!req.query.userId && !req.query.assignmentId) {
          throw new Error("Query parameter userId and/or assignmentId required");
        }
        if (req.query.userId) {
          params.userId = req.query.userId;
        }
        if (req.query.assignmentId) {
          params.assignmentId = req.query.assignmentId;
        }
        let reviewGradesReports = await db.review_grades_reports.findAll({
          where: params,
        });
        responseHandler.response200(res, reviewGradesReports);
        break;

      case "POST":
        if (req.query.type === "multiple") {
          await Promise.all(
            req.body.map(gradeReport =>
              db.review_grades_reports.create(gradeReport),
            ),
          );
        } else {
          await db.review_grades_reports.create(req.body);
        }
        responseHandler.msgResponse201(
          res,
          "Successfully created database entries.",
        );
        break;

        case "PATCH":
            if (req.query.type === "multiple") {
              // console.log(req.body);
              await Promise.all(
                req.body.map(report =>
                  db.review_grades_reports.update(report, {
                    where: { id: report.id },
                  }),
                ),
              );
              responseHandler.msgResponse201(
                res,
                "Successfully updated database entries.",
              );
            } else {
              throw new Error("PATCH /reviewGradesReports must be of type='multiple'");
            }
            break;

      default:
        throw new Error("Invalid HTTP method");
    }
  } catch (err) {
    responseHandler.response400(res, err);
  }
};
