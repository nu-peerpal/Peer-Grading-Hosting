const axios = require("axios")
const { server } = require("../../../config/index.js");
export const config = {
  api: {
    bodyParser: false,
  },
}

const canvas = process.env.CANVAS_HOST;
const token = process.env.CANVAS_TOKEN;
const responseHandler = require("../utils/responseHandler");

export default async (req, res) => {
    try {
      switch (req.method) {
        case "POST":
        //   if (!req.query.courseId || !req.query.assignmentId) {
        //     throw new Error("Query parameters courseId, assignmentId required");
        //   }
          let { courseId, assignmentId, grades } = req.body;
          // posts a grade to a submission, given courseId, assignmentId, userId, grades array
            const grade_data = {}
            var i = 0
            for (i = 0; i < grades.length; i++) {
                grade_data[grades[i][0]] = { posted_grade: grades[i][1] }
            }
            const data = {
                grade_data: grade_data
            }
            console.log('GRADE DATA:',data)
            let res = await axios.post(canvas + "courses/" + courseId + "/assignments/" + assignmentId + "/submissions/update_grades", data, {
                headers: {'Authorization': `Bearer ${token}`}
                }).catch(err => console.log('error:',err)) // might have to post by group at a future date.

            responseHandler.msgResponse201(
                res,
                "Successfully created Canvas entries.",
              );
          break;
        default:
          throw new Error("Invalid HTTP method");
      }
    } catch (err) {
      responseHandler.response400(res, err);
    }
  };
  