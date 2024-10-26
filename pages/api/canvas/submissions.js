const axios = require("axios")
const { server } = require("../../../config/index.js");

const canvas = process.env.CANVAS_HOST;
const token = process.env.CANVAS_TOKEN;
const responseHandler = require("../utils/responseHandler");

export default async (req, res) => {

    if (req.userData.student)
      return response401(res,"students are not not authorized");

    if (req.userData.context_id !== req.query.courseId)
      return response401(res,"cannot course id does not match authentication");


    try {
      switch (req.method) {
        case "GET":
          if (!req.query.courseId) {
            throw new Error("Query parameter courseId required");
          }
          if (!req.query.assignmentId) {
              throw new Error("Query parameter assignmentId required");
          }
          const response = await axios.get(canvas + "courses/" + req.query.courseId + "/assignments/" + req.query.assignmentId +"/submissions?include[]=group&per_page=300", {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          console.log('raw submissions: ',response.data.map(({workflow_state}) => workflow_state));

          const filteredSubmissions = response.data.filter(
            ({workflow_state}) => (workflow_state == 'submitted')
          );

          const submissions = filteredSubmissions.map(submission => {
            var submissionBody = submission.body
            if (submission.submission_type == 'online_upload') {
              if (submission.attachments) { // group change or user dropped, submission lost
                submissionBody = submission.attachments[0].url
              }
              // submissionBody = submission.preview_url; // possibly a way to get the document itself from this link
            }
            return {
              submissionType: submission.submission_type,
              submission: submissionBody,
              assignmentId: req.query.assignmentId,
              canvasId: submission.id,
              grade: submission.grade,
              groupId: submission.group.id,
              submitterId: submission.user_id,
            }
          })
          responseHandler.response200(res, submissions);
          break;
        default:
          throw new Error("Invalid HTTP method");
      }
    } catch (err) {
      responseHandler.response400(res, err);
    }
  };
