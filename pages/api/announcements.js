const db = require("../../models/index.js");

//this route will return an array of announcement strings based on courseId
export default async (req, res) => {
  try {
    switch (req.method) {
      case "GET":
        console.log("Getting announcements...");
        if (!req.query.courseId) {
          return res
            .status(400)
            .json({ error: "Query parameter courseId is required." });
        }
        const result = await db.announcements.findAll({
          attributes: ["announcement"],
          where: {
            courseId: req.query.courseId,
          },
        });
        console.log("Found announcements");
        return res.status(200).json(result);
      default:
        return res.status(405).json({ error: "Method not allowed " }); //Method Not Allowed
    }
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
