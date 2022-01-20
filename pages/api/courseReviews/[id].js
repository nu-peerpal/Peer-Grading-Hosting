const db = require("../../../models/index.js");
const responseHandler = require("../utils/responseHandler");
//const requestHandler = require("../utils/requestHandler");

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async (req, res) => {
  //INNER JOIN peer_matchings and assignments tables and filtering based on courseId  
  let peerMatchingsFiltered = await db.peer_matchings.findAll({ 
    attributes: ["review", "reviewReview", "assignmentId", "userId", "submissionId", "matchingType"],
    include: [{
      model: db.assignments,
      required: true,
      attributes: [],
      where: { courseId: req.query.id }
    }]
  });
  
  responseHandler.response200(res, peerMatchingsFiltered);
};
