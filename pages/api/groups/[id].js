const db = require("../../../models/index.js");
const responseHandler = require("../utils/responseHandler");

export default async (req, res) => {
  console.log("WARNING: THIS API [api/groups/:id] IS DEPRECATED");
  try {
    let group = await db.groups.findByPk(req.query.id);
    switch (req.method) {
      case "PATCH":
        if (req.body.userIds) {
          const enrollments = await db.group_enrollments.findAll({
            where: { groupId: req.query.id },
          });
          // create new enrollments for new userIds
          await Promise.all(
            req.body.userIds
              .filter(
                (userId) =>
                  !enrollments.map((obj) => obj.userId).includes(userId)
              )
              .map((userId) =>
                db.group_enrollments.create({ userId, groupId: req.query.id })
              )
          );
          // delete old users belonging to group
          await Promise.all(
            enrollments
              .filter(
                (enrollment) => !req.body.userIds.includes(enrollment.userId)
              )
              .map((enrollment) => enrollment.destroy())
          );
          delete req.body.userIds;
        }
        for (const property in req.body) {
          group[property] = req.body[property];
        }
        await group.save();
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
