import { assignments, peer_review_status } from "../../../models/index.js";
const db = require("../../../models/index.js");
const Op = db.Sequelize.Op;
const exHandler = require("../utils/exHandler");
//this route gives PR assignments that haven’t passed for that course and student

export default async (req, res) => {
  try {
    switch (req.method) {
      case "GET":
        const curr = db.Sequelize.literal("NOW()");
        if (req.query.current === 0) {
          curr = db.Sequelize.literal("NOW() - INTERVAL '365d'");
        }
        const peerMatchings = await db.peer_matchings.findAll({
          include: [
            {
              model: assignments,
              include: [{ model: peer_review_status, attributes: ["status"] }],
              where: {
                courseId: req.query.courseId,
                peerreviewDueDate: { [Op.gte]: curr },
              },
              required: true,
              attributes: ["name", "peerreviewDueDate"],
            },
          ],
          where: { userId: req.query.userId },
          //add date
        });
        res.json(peerMatchings);
        break;
      default:
        res.status(405).end(); //Method Not Allowed
    }
  } catch (err) {
    exHandler.response500(res, err);
  }
};
