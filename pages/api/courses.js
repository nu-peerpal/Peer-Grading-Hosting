//const db = require("../../models");
//const responseHandler = require("./utils/responseHandler");
const requestHandler = require("./utils/requestHandler");

export const config = {
  api: {
    bodyParser: false,
  },
}

const requestConfig = {
  table: "courses",
  getOptional: ["canvasId"]
};

export default async (req, res) => {
  await requestHandler.request(req,res,requestConfig);
};
