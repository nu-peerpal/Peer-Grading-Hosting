const db = require("../../../../models/index.js");
const responseHandler = require("../../utils/responseHandler");

export const config = {
    api: {
        bodyParser: false,
    },
}
const submissionsForReview = async (req, res) => {
    try {
        switch (req.method) {
            case "GET":
                if (!req.query.submissionId) {
                    throw new Error("Query parameter submissionId required");
                }
                const params = {};
                if (req.query.assignmentId) {
                    params.assignmentId = req.query.assignmentId
                }
                params.canvasId = req.query.submissionId;
                const submissions = await db.assignment_submissions.findOne({
                    where: params,
                });
                responseHandler.response200(res, submissions);
                break;

            default:
                throw new Error("Invalid HTTP method");
        }
    } catch (err) {
        responseHandler.response400(res, err);
    }
};

export default submissionsForReview;