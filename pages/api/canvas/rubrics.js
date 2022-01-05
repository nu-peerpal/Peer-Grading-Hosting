const axios = require("axios")
const { server } = require("../../../config/index.js");

const canvas = process.env.CANVAS_HOST;
const token = process.env.CANVAS_TOKEN;
const responseHandler = require("../utils/responseHandler");

export default async (req, res) => {
    try {
      switch (req.method) {
        case "GET":
          if (!req.query.courseId) {
            throw new Error("Query parameter courseId required");
          }
          const response = await axios.get(canvas + "courses/" + req.query.courseId + "/rubrics", {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          responseHandler.response200(res, response.data);
          break;
        default:
          throw new Error("Invalid HTTP method");
      }
    } catch (err) {
      responseHandler.response400(res, err);
    }
  };
