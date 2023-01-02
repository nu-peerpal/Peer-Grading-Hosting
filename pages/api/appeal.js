const db = require("../../models/index.js");
const Op = db.Sequelize.Op;
const responseHandler = require("./utils/responseHandler");
const requestHandler = require("./utils/requestHandler");
const _ = require("lodash");

export const config = {
  api: {
    bodyParser: false,
  },
}

async function getAppeals(submissionId,assignmentId) {
  const params = {
    assignmentId: assignmentId,
    submissionId: submissionId,
    matchingType: "appeal",
  };

  let appeals = await db.peer_matchings.findAll({ where: params });

  return appeals;
}

async function getSubmissionId(userId,assignmentId) {
  const submissions = await db.group_enrollments.findAll({ where: {
    userId,
    assignmentId
  }});

  if (submissions.length > 1) {
    console.log('found multiple submissions for user:', submissions);
  }

  return (submission.length) ? submissions[0].submissionId : undefined;
}

export default async (req, res) => {
  try {
    const {assignmentId,userId} = req.query;
    var {submissionId} = req.query;

    if (!assignmentId) {
      throw new Error("Query parameter assignmentId required");
    }

    if (!userId && !submissionId) {
      throw new Error("Query parameter userId or submissionId required");
    }

    if (!submissionId)
    {
      submissionId = await getSubmissionId(
        userId,
        assignmentId
      );
    }

    if (!submissionId) {
      console.log(`APPEAL ${req.method}: no submission, no appeal for user ${userId} on assignment ${assignmentId}`);
      responseHandler.response200(res, []);
      return;
    }

    const appeals = await getAppeals(submissionId,assignmentId);

    switch (req.method) {
      case "GET":

        responseHandler.response200(res, appeals);


        break;

      case "DELETE":

        // Jason: may not want to allow delete if there is a review already!!

        if (!appeals.length)
        {
          console.log(`APPEAL DELETE: no appeal to delete for user ${userId} on assignment ${assignmentId}`);
          responseHandler.msgResponse200(
            res,
            "no appeal to delete"
          );
          break;
        }

        const params = {
          assignmentId: req.query.assignmentId,
          submissionId: submissionId,
          matchingType: "appeal",
        };

        await db.peer_matchings.destroy({ where: params });

        responseHandler.msgResponse200(
          res,
          `deleted ${appeals.length} appeals`
        );

        break;

      case "PUT":

        if (appeals.length) {
          console.log(`APPEAL PUT: multiple appeals for user ${userId} on assignment ${assignmentId}`);
          responseHandler.msgResponse400(res, "already appealed");
          break;
        }

        // allow reviewerId in post request (note: userId is the id of the submitter)
        let {reviewerId} = req.query;

        // pick a random TA to review this appeal
        if (!reviewerId) {

          const taMatchings = await db.peer_matchings.findAll({where: {
            assignmentId,
            matchingType: "TA"
          }});

          const tas = _.uniq(taMatchings.map(({userId}) => userId));

          if (!tas.length) {
            console.log(`APPEAL PUT: cannot assign appeals if no TAs matched for ${assignmentId}`);
            responseHandler.msgResponse400(res, "no TAs matched, cannot appeal");
            break;
          }

          reviewerId = _.sample(tas);
        }

        let result = await db.peer_matchings.create({
          assignmentId,
          submissionId,
          userId: reviewerId,
          matchingType: "appeal",
          review: null,
          reviewReview: null,
          assignmentSubmissionId: null,
        });

        responseHandler.response201(
          res,
          result.data
        );
      break;

      default:
        throw new Error("Invalid HTTP method");
    }
  } catch (err) {
    responseHandler.response400(res, err);
  }
};
