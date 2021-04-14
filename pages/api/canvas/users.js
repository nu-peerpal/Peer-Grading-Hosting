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
        // gets up to 300 users from a course given the courseId
        let courseId = req.query.courseId
        const response = await axios.get(canvas + "courses/" + courseId + "/enrollments?per_page=300", {
        headers: {
            'Authorization': `Bearer ${token}`
        }
        });
        const users = response.data.map(user => {
            const name = user.user.short_name.split(' ');
            if (name.length==1) {
                name.push("")
            }
            return {
                canvasId: user.user_id,
                lastName: name[1],
                firstName: name[0],
                enrollment: user.type,
                courseId: user.course_id
            }
        });
        responseHandler.response200(res, users);
        break;
      default:
        throw new Error("Invalid HTTP method");
    }
  } catch (err) {
    responseHandler.response400(res, err);
  }
};
