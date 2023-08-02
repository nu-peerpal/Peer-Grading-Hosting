const db = require("../../../../../models/index.js");
const Op = db.Sequelize.Op;
const responseHandler = require("../../../utils/responseHandler");
const {checkUserInCourse} = require("../../../utils/checkUserInCourse");

export const config = {
    api: {
        bodyParser: false,
    },
}

const assignmentsHandler = async (req, res) => {
    try {
        switch (req.method) {
            case "GET":
                const {userId,courseId} = req.query;
                if (!courseId) {
                    throw new Error("Query parameter courseId required");
                }

                await checkUserInCourse({userId, courseId});

                const params = { courseId: req.query.courseId };
                if (req.query.minReviewDueDate) {
                    // let today = new Date();
                    // today.setHours(today.getHours() - 1); // add 1 hour offset
                    params.reviewDueDate = {
                        [Op.gte]: today,
                    };
                }
                if (req.query.graded === "true") {
                    params.graded = true;
                }
                if (req.query.reviewStatus) {
                    params.reviewStatus = req.query.reviewStatus;
                }

                let assignments = await db.assignments.findAll({ where: params });
                // Fake join submissionId using groupEnrollments
                assignments = await Promise.all(assignments.map(async assignment => {
                        const enrollments = await db.group_enrollments.findAll({
                            where: {
                                assignmentId: assignment.id,
                                userId
                            }
                        });
                        if (enrollments.length > 0 && enrollments[0] && enrollments[0].submissionId) {
                            assignment.submissionId = enrollments[0].submissionId;
                        }
                        return assignment;
                    }
                ));
                responseHandler.response200(res, assignments);
                break;

            default:
                throw new Error("Invalid HTTP method");
        }
    } catch (err) {
        responseHandler.response400(res, err);
    }
};

export default assignmentsHandler;