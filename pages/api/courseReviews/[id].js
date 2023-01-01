const db = require("../../../models/index.js");
const responseHandler = require("../utils/responseHandler");
//const requestHandler = require("../utils/requestHandler");

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async (req, res) => {

  // if userId is specified, filter by userId
  var filterUserId = {};
  if (req.query.userId) filterUserId.userId = req.query.userId;

  //INNER JOIN peer_matchings and assignments tables and filtering based on courseId & potentially userID
  let peerMatchingsFiltered = await db.peer_matchings.findAll({ 
    attributes: ["review", "reviewReview", "assignmentId", "userId", "submissionId", "matchingType"],
    where: filterUserId,
    include: [{
      model: db.assignments,
      required: true,
      attributes: [],
      where: { courseId: req.query.id }
    }]
  });
  
  responseHandler.response200(res, peerMatchingsFiltered);
};
