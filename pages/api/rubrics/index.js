const db = require("../../../models/index.js");
const responseHandler = require("../utils/responseHandler");
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async (req, res) => {
  try {
    switch (req.method) {
      case "POST":
        if (req.query.type === "multiple") {
          console.log('made it to post')
          await Promise.all(
            req.body.map((rubric) => db.rubrics.create(rubric))
          );
        } else {
          await db.rubrics.create(req.body);
        }
        responseHandler.msgResponse201(
          res,
          "Successfully created database entries."
        );
        break;

      default:
        throw new Error("Invalid HTTP method");
    }
  } catch (err) {
    responseHandler.response400(res, err);
  }
};