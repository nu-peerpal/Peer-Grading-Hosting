import { User } from "grommet-icons";

const db = require("../../../models/index.js");
const responseHandler = require("../utils/responseHandler");
const includeExcludeProps = require("../utils/includeExcludeProps");

export default async (req, res) => {
  try {
    switch (req.method) {
      case "GET":
        if (!req.query.userId && !req.query.assignmentId) {
          throw new Error("Query parameter userId OR assignmentId required");
        }
        const params = {};
        if (req.query.assignmentId) {
          params.assignmentId = req.query.assignmentId;
        }
        if (req.query.userId) {
          params.userId = req.query.userId;
        }
        let submissions = await db.assignment_submissions.findAll({
          where: params,
        });
        submissions = submissions.map((submission) =>
          includeExcludeProps(req, submission)
        );
        responseHandler.response200(res, submissions);
        break;

      case "PATCH":
        if (req.query.type === "multiple") {
          await Promise.all(
            req.body.map((submission) => {
              db.assignment_submissions.update(submission, {
                where: { id: submission.id },
              });
            })
          );
          responseHandler.msgResponse200(
            res,
            "Successfully updated database entries."
          );
        } else {
          throw new Error("PATCH /submissions must be of type='multiple'");
        }
        break;

      default:
        throw new Error("Invalid HTTP method");
    }
  } catch (err) {
    responseHandler.response400(res, err);
  }
};
