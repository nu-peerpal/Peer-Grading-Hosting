import db from "../../../../../models";
import responseHandler from "../../../utils/responseHandler";
import {studentRequest} from "../../../utils/peerHandler";

export const config = {
    api: {
        bodyParser: false,
    },
}

const peerReviewHandler = async (req, res) => {
    const table = db["peer_matchings"];

    try {
        let row = await table.findByPk(req.query.id);

        switch (req.method) {
            case "GET":
                if (row.dataValues.userId != req.query.userId) {
                    // Calling user did not do this review,
                    // so make sure that calling user submitted the thing being reviewed
                    const enrollments = await db.group_enrollments.findAll({
                        where: {
                            submissionId: row.submissionId,
                            userId: req.query.userId,
                        }
                    });
                    if (enrollments.length < 0) {
                        throw new Error("Review is not associated with user requesting it");
                    }
                    // The calling user is the submitter, not the reviewer, so they should not be able to know the
                    // reviewer's id
                    delete row.dataValues.userId;
                    delete row._previousDataValues.userId;
                    row._options.attributes = row._options.attributes.filter(attr => attr !== 'userId');
                }
                responseHandler.response200(res, row);
                break;

            case "PATCH":
                if (row.dataValues.userId != req.query.userId) {
                    // Calling user is not assigned to this review, so they should not be allowed to modify it
                    throw new Error("Caller does not have permission to complete or modify this review");
                }
                for (const property in req.body) {
                    row[property] = req.body[property];
                }
                const response = await row.save();
                responseHandler.response201(
                    res,
                    response.dataValues
                );
                break;

            default:
                throw new Error("Invalid HTTP method");
        }
    } catch (err) {
        console.log('idRequest',{err})
        responseHandler.response400(res, err);
    }
};

const studentPeerReviewHandler = async (req, res) => studentRequest(req, res, peerReviewHandler);

export default studentPeerReviewHandler;