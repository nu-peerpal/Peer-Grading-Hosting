const db = require("../../../../../models/index.js");
const responseHandler = require("../../../utils/responseHandler");
const {checkUserInCourse} = require("../../../utils/checkUserInCourse");

export const config = {
    api: {
        bodyParser: false,
    },
}

export default async (req, res) => {
    const table = db.assignments;

    try {
        switch (req.method) {
            case "GET":
                let row = await table.findByPk(req.query.id);
                await checkUserInCourse({
                    userId: req.query.userId,
                    courseId: row.courseId
                });
                responseHandler.response200(res, row);
                break;

            default:
                throw new Error("Invalid HTTP method");
        }
    } catch (err) {
        console.log('idRequest',{err})
        responseHandler.response400(res, err);
    }
};