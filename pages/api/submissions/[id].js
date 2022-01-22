//const db = require("../../../models/index.js");
//const responseHandler = require("../utils/responseHandler");
const requestHandler = require("../utils/requestHandler");

export default async (req, res) => {
  await requestHandler.idRequest(req,res,{table:"assignment_submissions"});
};
