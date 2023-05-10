const db = require("../../../models/index.js");

exports.checkUserInCourse = async ({userId, courseId}) => {
    let enrollments = await db.course_enrollments.findAll({
        where: {
            userId,
            courseId,
        }
    });
    if (enrollments.length < 1) {
        throw new Error("User is not enrolled in course")
    }
}