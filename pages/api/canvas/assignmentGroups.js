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
          const response = await axios.get(canvas + "courses/" + req.query.courseId + "/assignment_groups", {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          const groups = response.data.map(groupObj => {
            return {
              id: groupObj.id,
              name: groupObj.name
            }
          })
          responseHandler.response200(res, groups);
          break;
        default:
          throw new Error("Invalid HTTP method");
      }
    } catch (err) {
      responseHandler.response400(res, err);
    }
  };
  