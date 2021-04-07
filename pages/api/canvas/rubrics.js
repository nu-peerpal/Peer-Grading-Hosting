const axios = require("axios")
const { server } = require("../../../config/index.js");

const canvas = "http://ec2-3-22-99-14.us-east-2.compute.amazonaws.com/api/v1/"
const token = process.env.DEV_CANVAS_TOKEN;
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
  