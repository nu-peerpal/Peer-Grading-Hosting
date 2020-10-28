const db = require("../../../models/index.js");
const responseHandler = require("../utils/responseHandler");

export default async (req, res) => {
  try {
    let user = await db.users.findByPk(req.query.id);

    switch (req.method) {
      case "PATCH":
        if (req.body.groupIds) {
          const enrollments = await db.group_enrollments.findAll({
            where: { userId: req.query.id },
          });
          // create new enrollments for new groupIds
          await Promise.all(
            req.body.groupIds
              .filter(
                (groupId) =>
                  !enrollments.map((obj) => obj.groupId).includes(groupId)
              )
              .map((groupId) =>
                db.group_enrollments.create({ userId: req.query.id, groupId })
              )
          );
          // delete old groupIds for user
          await Promise.all(
            enrollments
              .filter(
                (enrollment) => !req.body.groupIds.includes(enrollment.groupId)
              )
              .map((enrollment) => enrollment.destroy())
          );
          delete req.body.groupIds;
        }
        for (const property in req.body) {
          user[property] = req.body[property];
        }
        await user.save();
        responseHandler.msgResponse200(
          res,
          "Successfully updated database entry."
        );
        break;
      default:
        throw new Error("Invalid HTTP method");
    }
  } catch (err) {
    responseHandler.response400(res, err);
  }
};
