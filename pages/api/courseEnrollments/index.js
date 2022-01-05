// const db = require("../../../models/index.js");
// const Op = db.Sequelize.Op;
const responseHandler = require("../utils/responseHandler");
const requestHandler = require("../utils/requestHandler");

export const config = {
  api: {
    bodyParser: false,
  },
}

const requestConfig = {
  table: "course_enrollments",
  getRequired: ['courseId','userId','id'],
  getRequiredCount: 1,
  getOptional: ['enrollment']
};


const CourseEnrollmentsHandler = async (req, res) => {
  await requestHandler.request(req,res,requestConfig);
};

export default CourseEnrollmentsHandler;
