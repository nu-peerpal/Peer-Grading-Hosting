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
          let response, assignments;
          if (req.query.type === "multiple") {
            response = await axios.get(canvas + "courses/" + req.query.courseId + "/assignments?per_page=80", {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            assignments = response.data.map(assignment => {
              let rubricId = null;
              if (assignment.rubric_settings) {
                rubricId = assignment.rubric_settings.id;
              }
              return {
                courseId: req.query.courseId,
                assignmentDueDate: assignment.due_at,
                canvasId: assignment.id,
                name: assignment.name,
                rubricId: rubricId,
              }
            });
          } else {
            if (!req.query.assignmentId) {
              throw new Error("Query parameter assignmentId required");
            }
            response = await axios.get(canvas + "courses/" + req.query.courseId + "/assignments/" + req.query.assignmentId, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            assignments = {
              name: response.data.name,
              published: response.data.published,
              submissionType: response.data.submission_types,
              ungradedSubmissions: response.data.needs_grading_count,
              groupAssignment: response.data.group_category_id
            }
          }
          // console.log('assignment response:',response)
          responseHandler.response200(res, assignments);
          break;
        default:
          throw new Error("Invalid HTTP method");
      }
    } catch (err) {
      responseHandler.response400(res, err);
    }
  };
