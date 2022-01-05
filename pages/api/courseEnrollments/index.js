const db = require("../../../models/index.js");
const Op = db.Sequelize.Op;
const responseHandler = require("../utils/responseHandler");
export const config = {
  api: {
    bodyParser: false,
  },
}

const CourseEnrollmentsHandler = async (req, res) => {
  try {
    switch (req.method) {
      case "GET":
        if (!req.query.courseId && !req.query.userId) {
          throw new Error("Query parameter courseId or userId required");
        }
        if (req.query.userId) {
          params.userId = req.query.userId;
        }
        if (req.query.courseId) {
          params.courseId = req.query.courseId;
        }

        let course_enrollments = await db.course_enrollments.findAll({ where: params });
        responseHandler.response200(res, course_enrollments);
        break;

      case "POST":
        if (req.query.type === "multiple") {
          await Promise.all(
            req.body.map(courseEnrollment => db.course_enrollments.create(courseEnrollment)),
          );
        } else {
          await db.course_enrollments.create(req.body);
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

export default CourseEnrollmentsHandler;
