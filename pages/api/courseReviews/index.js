const db = require("../../../models/index.js");
const Op = db.Sequelize.Op;
const responseHandler = require("../utils/responseHandler");
const requestHandler = require("../utils/requestHandler");


export const config = {
  api: {
    bodyParser: false,
  },
}

export default async (req, res) => {
   
    try {
        throw new Error("Invalid HTTP method. Must specify a courseID as such: /api/courseReviews/[courseId]")
    } catch (err) {
        responseHandler.response400(res, err);
    }
    
};
