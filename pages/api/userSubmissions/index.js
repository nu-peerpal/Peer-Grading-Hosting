const db = require("../../../models");
const responseHandler = require("../utils/responseHandler");

const userSubmissionsHandler = async (req, res) => {
  try {
    switch (req.method) {
      case "GET":
        if (!req.query.submissionId && !req.query.userId) {
          throw new Error("Query parameter submissionId or userId required");
        }
        let params = {};
        if (req.query.submissionId) {
          params = { submissionId: req.query.submissionId };
        }
        if (req.query.userId) {
          params = { userId: req.query.userId };
        }

        let userSubmissions = await db.user_submissions.findAll({
          where: params,
          // where: { assignmentId: req.query.assignmentId },
          // include: {
          //   model: db.user_submissions,
          //   attributes: ["userId"],
          //   where: params,
          // },
        });
        responseHandler.response200(res, userSubmissions);
        break;

      case "POST":
        const separateUserIds = userSubmissionObj => {
          const userIds = userSubmissionObj.userIds;
          delete userSubmissionObj.userIds;
          return [userSubmissionObj, userIds];
        };

        if (req.query.type === "multiple") {
          await Promise.all(
            req.body.map(userSubmissionObj => {
              const [userSubmission, userIds] = separateUserIds(userSubmissionObj);
              return Promise.all(
                userIds.map(userId =>
                  db.user_submissions.create({
                    userId,
                    submissionId: userSubmission.submissionId
                  }),
                ),
              )
            }))
        } else {
          const [userSubmission, userIds] = separateUserIds(req.body);
          await Promise.all(
            userIds.map(userId =>
              db.user_submissions.create({
                userId,
                submissionId: userSubmission.submissionId
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
