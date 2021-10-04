const db = require("../../../models/index.js");
const Op = db.Sequelize.Op;
const responseHandler = require("../utils/responseHandler");
export const config = {
  api: {
    bodyParser: false,
  },
}

const GroupEnrollmentsHandler = async (req, res) => {
  try {
    switch (req.method) {
      case "GET":
        if (!req.query.assignmentId) {
          throw new Error("Query parameter assignmentId required");
        }
        let params = { assignmentId: req.query.assignmentId};
        if (req.query.userId) {
          params.userId = req.query.userId;
        }
        if (req.query.submissionId) {
          params.submissionId = req.query.submissionId;
        }

        let group_enrollments = await db.group_enrollments.findAll({ where: params });
        responseHandler.response200(res, group_enrollments);
        break;

      case "POST":
        if (req.query.type === "multiple") {
          await Promise.all(
            req.body.map(groupEnrollment => db.group_enrollments.create(groupEnrollment)),
          );
        } else {
          await db.group_enrollments.create(req.body);
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

export default GroupEnrollmentsHandler;
