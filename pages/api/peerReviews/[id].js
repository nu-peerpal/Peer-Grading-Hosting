const db = require("../../../models/index.js");
const responseHandler = require("../utils/responseHandler");

export default async (req, res) => {
  try {
    let peerMatching = await db.peer_matchings.findByPk(req.query.id);
    switch (req.method) {
      case "GET":
        responseHandler.response200(res, peerMatching);
        break;
      case "PATCH":
        for (const property in req.body) {
          peerMatching[property] = req.body[property];
        }
        await peerMatching.save();
        responseHandler.msgResponse200(
          res,
          "Successfully updated database entry.",
        );
        break;
      default:
        throw new Error("Invalid HTTP method");
    }
  } catch (err) {
    responseHandler.response400(res, err);
  }
};
