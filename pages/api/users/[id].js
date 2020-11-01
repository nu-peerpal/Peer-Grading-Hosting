const db = require("../../../models/index.js");
const responseHandler = require("../utils/responseHandler");

export default async (req, res) => {
  try {
    let user = await db.users.findByPk(req.query.id);

    switch (req.method) {
      case "PATCH":
        for (const property in req.body) {
          user[property] = req.body[property];
        }
        await user.save();
        responseHandler.msgResponse200(
          res,
          "Successfully updated database entry."
        );
        break;
      default:
        throw new Error("Invalid HTTP method");
    }
  } catch (err) {
    responseHandler.response400(res, err);
  }
};
