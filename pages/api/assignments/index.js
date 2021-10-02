const db = require("../../../models/index.js");
const Op = db.Sequelize.Op;
const responseHandler = require("../utils/responseHandler");
const requestHandler = require("../utils/requestHandler");

export const config = {
  api: {
    bodyParser: false,
  },
}

const assignmentsHandler = async (req, res) => {
  try {
    switch (req.method) {
      case "GET":
        if (!req.query.courseId) {
          throw new Error("Query parameter courseId required");
        }
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
        responseHandler.response200(res, assignments);
        break;

      case "POST":
        await requestHandler.post(req,res, {table: "assignments"});
        break;

      default:
        throw new Error("Invalid HTTP method");
    }
  } catch (err) {
    responseHandler.response400(res, err);
  }
};

export default assignmentsHandler;
