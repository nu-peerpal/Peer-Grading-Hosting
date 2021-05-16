const db = require("../../../models");
const responseHandler = require("../utils/responseHandler");

const userSubmissionsHandler = async (req, res) => {
  try {
    switch (req.method) {
      case "GET":
        if (!req.query.assignmentId) {
          throw new Error("Query parameter assignmentId required");
        }
        let params = {};
        if (req.query.userId) {
          params = { userId: req.query.userId };
        }

        let userSubmissions = await db.user_submissions.findAll({
          where: { assignmentId: req.query.assignmentId },
          include: {
            model: db.user_submissions,
            attributes: ["userId"],
            where: params,
          },
        });
        responseHandler.response200(res, userSubmissions);
        break;

      case "POST":
        const separateUserIds = groupObj => {
          const userIds = groupObj.userIds;
          delete groupObj.userIds;
          return [groupObj, userIds];
        };

        if (req.query.type === "multiple") {
          await Promise.all(
            req.body.map(groupObj => {
              const [group, userIds] = separateUserIds(groupObj);
              return db.groups.create(group).then(dbGroup =>
                Promise.all(
                  userIds.map(userId =>
                    db.group_enrollments.create({
                      groupId: dbGroup.id,
                      userId,
                    }),
                  ),
                ),
              );
            }),
          );
        } else {
          const [group, userIds] = separateUserIds(req.body);
          const dbGroup = await db.groups.create(group);
          await Promise.all(
            userIds.map(userId =>
              db.group_enrollments.create({
                groupId: dbGroup.id,
                userId,
              }),
            ),
          );
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

export default userSubmissionsHandler;
