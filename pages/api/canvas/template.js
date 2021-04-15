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
          let courseId = req.query.courseId
          const response = await axios.get(canvas + "courses/" + courseId + "/enrollments?per_page=300", {
          headers: {
              'Authorization': `Bearer ${token}`
          }
          });
          const users = response;
          responseHandler.response200(res, users);
          break;
        default:
          throw new Error("Invalid HTTP method");
      }
    } catch (err) {
      responseHandler.response400(res, err);
    }
  };
  