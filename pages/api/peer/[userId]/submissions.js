import {studentRequest} from "../../utils/peerHandler";

const db = require("../../../../models/index.js");
const responseHandler = require("../../utils/responseHandler");


export const config = {
    api: {
        bodyParser: false,
    },
}

const checkGroupEnrollments = async (userId, submissionId) => {
    let group_enrollments = await db.group_enrollments.findAll({
        where: {
            userId,
            submissionId
        }
    });
    if (group_enrollments.length < 1) {
        throw new Error("Submission was not submitted by the calling peer");
    }
}
const submissionsHandler = async (req, res) => {
    try {
        switch (req.method) {
            case "GET":
                if (!req.query.submissionId || !req.query.assignmentId) {
                    throw new Error("Query parameters submissionId and assignmentId required");
                }
                const params = {
                    assignmentId: req.query.assignmentId,
                    canvasId: req.query.submissionId,
                };
                const submissions = await db.assignment_submissions.findAll({
                    where: params,
                });
                await checkGroupEnrollments(req.query.userId, req.query.submissionId);
                responseHandler.response200(res, submissions);
                break;

            default:
                throw new Error("Invalid HTTP method");
        }
    } catch (err) {
        responseHandler.response400(res, err);
    }
};

const studentSubmissionsHandler = async (req, res) => studentRequest(req, res, submissionsHandler);

export default studentSubmissionsHandler;
