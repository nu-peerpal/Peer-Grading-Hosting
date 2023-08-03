const {response403} = require("./responseHandler");
exports.studentRequest = async (req, res, handle) => {
    if (req.userData.student && req.userData.user_id !== req.query.userId) {
        console.log("Student attempt to act as another student: REJECTED");
        response403(res);
    }
    // We have ensured that either:
    // - The authenticated user is a non-student, or
    // - The user_id of the authenticated user matches the [userId] in the url
    return handle(req, res);
}