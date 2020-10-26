const db = require("../../../models/index.js");
const responseHandler = require("../utils/responseHandler");
const includeExcludeProps = require("../utils/includeExcludeProps");

export default async (req, res) => {
  try {
    let peerMatching = await db.peer_matchings.findByPk(req.query.id);
    switch (req.method) {
      case "GET":
        peerMatching = includeExcludeProps(req, peerMatching);
        responseHandler.response200(peerMatching);
        break;
      case "PATCH":
        for (const property in req.body) {
          peerMatching[property] = req.body[property];
        }
        await peerMatching.save();
        responseHandler.msgResponse200("Successfully updated database entry.");
        break;
      default:
        throw new Error("Invalid HTTP method");
    }
  } catch (err) {
    responseHandler.response400(res, err);
  }
};
