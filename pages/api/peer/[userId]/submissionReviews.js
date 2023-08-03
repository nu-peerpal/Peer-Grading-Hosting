import {studentRequest} from "../../utils/peerHandler";

const db = require("../../../../models/index.js");
const Op = db.Sequelize.Op;
const responseHandler = require("../../utils/responseHandler");


export const config = {
    api: {
        bodyParser: false,
    },
}

const submissionReviewsHandler = async (req, res) => {
    try {
        switch (req.method) {
            case "GET":
                if (!req.query.assignmentId) {
                    throw new Error("Query parameter assignmentId required");
                }

                const params = { assignmentId: req.query.assignmentId };

                if (req.query.done === "true") {
                    params.review = { [Op.not]: null }; // review is not empty
                }

                if (req.query.submissionId) {
                    params.submissionId = req.query.submissionId;
                } else {
                    let groups = await db.group_enrollments.findAll({where:{
                            assignmentId: req.query.assignmentId,
                            userId: req.query.userId
                        }});

                    if (groups.length > 1)
                        console.log(`peerReviews GET: got more than one submission for user ${req.query.userId} on assignment ${req.query.assignmentId}`);

                    if (!groups.length) {
                        responseHandler.response200(res, []);
                    }

                    params.submissionId = groups[0].submissionId;
                }

                let peerMatchings = await db.peer_matchings.findAll({ where: params });

                // if scores has length 0 then review is not done.
                if (req.query.done === "true") {
                    peerMatchings = peerMatchings.filter(({dataValues}) => dataValues.review && dataValues.review.reviewBody.scores.length)
                }

                responseHandler.response200(res, peerMatchings);
                break;

            default:
                throw new Error("Invalid HTTP method");
        }
    } catch (err) {
        responseHandler.response400(res, err);
    }
};

const studentSubmissionReviewsHandler = async (req, res) => studentRequest(req, res, submissionReviewsHandler);

export default studentSubmissionReviewsHandler;
