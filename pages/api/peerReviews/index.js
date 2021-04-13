const db = require("../../../models/index.js");
const Op = db.Sequelize.Op;
const responseHandler = require("../utils/responseHandler");
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async (req, res) => {
  try {
    switch (req.method) {
      case "GET":
        if (!req.query.assignmentId) {
          throw new Error("Query parameter assignmentId required");
        }
        const params = { assignmentId: req.query.assignmentId };
        if (req.query.done === "true") {
          params.review = { [Op.not]: null }; // review is not empty
        }
        if (req.query.userId || req.query.userId === 0) {
          params.userId = req.query.userId;
        }

        let peerMatchings = await db.peer_matchings.findAll({ where: params });
        responseHandler.response200(res, peerMatchings);
        break;

      case "POST":
        if (req.query.type === "multiple") {
          await Promise.all(
            req.body.map(matching => db.peer_matchings.create(matching)),
          );
        } else {
          await db.peer_matchings.create(req.body);
        }
        responseHandler.msgResponse201(
          res,
          "Successfully created database entries.",
        );
        break;

      default:
        throw new Error("Invalid HTTP method");
    }
  } catch (err) {
    responseHandler.response400(res, err);
  }
};
