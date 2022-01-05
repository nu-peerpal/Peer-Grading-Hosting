const db = require("../../../models/index.js");
const responseHandler = require("../utils/responseHandler");
const requestHandler = require("../utils/requestHandler");


export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  await requestHandler.request(req,res,{table:"rubrics"});
};
