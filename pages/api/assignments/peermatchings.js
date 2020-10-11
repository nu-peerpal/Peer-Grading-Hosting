const db = require("../../../models/index.js");
const exHandler = require("../utils/exHandler");

// this route will return all peer review matching with userId & assignmentId
export default async (req, res) => {
  try {
    if (!req.query.userId || !req.query.assignmentId) {
      throw new Error("Query parameters userId and assignmentId required");
    }
    switch (req.method) {
      case "GET":
        const peerMatchings = await db.peer_matchings.findAll({
          where: {
            userId: req.query.userId,
            assignmentId: req.query.assignmentId,
          },
        });
        res.json(peerMatchings);
        break;
      default:
        res.status(405).end(); // Method Not Allowed
    }
  } catch (err) {
    exHandler.response400(res, err);
  }
};
