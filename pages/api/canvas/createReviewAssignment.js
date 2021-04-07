const axios = require("axios")
const { server } = require("../../../config/index.js");

const canvas = "http://ec2-3-22-99-14.us-east-2.compute.amazonaws.com/api/v1/"
const token = process.env.DEV_CANVAS_TOKEN;
const responseHandler = require("../utils/responseHandler");

export default async (req, res) => {
    try {
      switch (req.method) {
        case "POST":
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
  

console.log('pr due date: ',prDueDate)
  const data = {
    assignment: { 
      name: prName,
      due_at: prDueDate, //"2021-05-01T11:59:00Z"
      description: "Peer Review Assignment for " + assignmentName,
      published: true,
      assignment_group_id: prGroup,
      points: rubric.points_possible
    }
  }
  const response = await axios.post(canvas + "courses/" + courseId + "/assignments", data, {
    headers: {'Authorization': `Bearer ${token}`}
  })
  const newAssignment = response.data
  const rubricData = {
    rubric_association: {
      rubric_id: rubric.id,
      association_id: newAssignment.id,
      association_type: "Assignment",
      purpose: "grading"
    }
  }
  axios.post(canvas + "courses/" + courseId + "/rubric_associations", rubricData, {
    headers: {'Authorization': `Bearer ${token}`}
  })
  const assignment = {
    assignmentDueDate: assignmentDueDate,
    reviewDueDate: newAssignment.due_at,
    reviewStatus: 0,
    canvasId: assignmentId,
    reviewCanvasId: newAssignment.id,
    graded: false,
    name: assignmentName,
    courseId: courseId,
  }
  return assignment