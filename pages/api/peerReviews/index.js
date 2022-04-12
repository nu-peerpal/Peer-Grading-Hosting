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
        if (req.query.matchingType) {
          params.matchingType = req.query.matchingType;
        }
        let peerMatchings = await db.peer_matchings.findAll({ where: params });

        // is scores has length 0 then review is not done.
        if (req.query.done === "true") {
          peerMatchings = peerMatchings.filter(({dataValues}) => dataValues.review && dataValues.review.reviewBody.scores.length)
        }

        responseHandler.response200(res, peerMatchings);
        break;
      case "PATCH":
          console.log(req.body);
          for (const property in req.body) {
            peerMatching[property] = req.body[property];
          }
          await peerMatching.save();
          responseHandler.msgResponse200(
          res,
          "Successfully updated database entry.",
        );
        break;
      case "POST":
        await requestHandler.post(req,res, {table: "peer_matchings"});

        break;

      default:
        throw new Error("Invalid HTTP method");
    }
  } catch (err) {
    responseHandler.response400(res, err);
  }
};
