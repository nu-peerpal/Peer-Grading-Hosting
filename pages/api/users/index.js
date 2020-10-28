const db = require("../../models");
const responseHandler = require("./utils/responseHandler");
const includeExcludeProps = require("./utils/includeExcludeProps");

export default async (req, res) => {
  try {
    switch (req.method) {
      case "GET":
        if (!req.query.courseId) {
          throw new Error("Query parameter courseId required");
        }
        const params = { courseId: req.query.courseId };
        if (req.query.enrollment) {
          params.enrollment = req.query.enrollment;
        }

        let extraParams = {};
        if (req.query.groupId) {
          extraParams = { where: { groupId: req.query.groupId } };
        }

        let users = await db.users.findAll({
          where: params,
          include: {
            model: db.group_enrollments,
            attributes: ["groupId"],
            ...extraParams,
          },
        });
        users = users.map((user) => includeExcludeProps(req, user));
        responseHandler.response200(res, users);
        break;

      case "POST":
        if (req.query.type === "multiple") {
          await Promise.all(req.body.map((user) => db.users.create(user)));
        } else {
          await db.users.create(req.body);
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
