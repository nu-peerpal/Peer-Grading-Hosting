const db = require("../../models");
const responseHandler = require("./utils/responseHandler");

export default async (req, res) => {
  try {
    console.log("courseEnrollments")
    switch (req.method) {
      case "POST":
        if (req.query.type === "multiple") {
          await Promise.all(
            req.body.map((courseEnrollment) =>
              db.course_enrollments.create(courseEnrollment)
            )
          );
        } else {
          await db.course_enrollments.create(req.body);
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
