const db = require("../../../models");
const responseHandler = require("../utils/responseHandler");
const includeExcludeProps = require("../utils/includeExcludeProps");

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

      case "POST":
        const separateUserIds = (groupObj) => {
          const userIds = groupObj.userIds;
          delete groupObj.userIds;
          return [groupObj, userIds];
        };

        if (req.query.type === "multiple") {
          await Promise.all(
            req.body.map((groupObj) => {
              const [group, userIds] = separateUserIds(groupObj);
              return db.groups.create(group).then((dbGroup) =>
                Promise.all(
                  userIds.map((userId) =>
                    db.group_enrollments.create({
                      groupId: dbGroup.id,
                      userId,
                    })
                  )
                )
              );
            })
          );
        } else {
          const [group, userIds] = separateUserIds(req.body);
          const dbGroup = await db.groups.create(group);
          await Promise.all(
            userIds.map((userId) =>
              db.group_enrollments.create({
                groupId: dbGroup.id,
                userId,
              })
            )
          );
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
