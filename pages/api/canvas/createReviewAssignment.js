const axios = require("axios")
export const config = {
  api: {
    bodyParser: false,
  },
}

const canvas = "http://ec2-3-22-99-14.us-east-2.compute.amazonaws.com/api/v1/"
const token = process.env.DEV_CANVAS_TOKEN;
const responseHandler = require("../utils/responseHandler");

export default async (req, res) => {
  try {
    switch (req.method) {
      case "POST":
        const { courseId, assignmentName, prName, prDueDate, prGroup, rubric } = req.body
        const data = {
          assignment: { 
            name: prName,
            due_at: prDueDate, //"2021-05-01T11:59:00Z"
            description: "Peer Review Assignment for " + assignmentName,
            published: true,
            assignment_group_id: prGroup,
            points: rubric.points_possible,
            submission_types: [ "external_tool" ],
            external_tool_tag_attributes: {
              url: 'http://localhost:8081',
              new_tab: true,
              resource_link_id: '953a070579c571fc4b9b8a7a95bf6c0dc1b365d6',
              external_data: '',
              content_type: 'ContextExternalTool',
              content_id: 14
            }
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
        }).then(res => console.log(res))
        const assignment = {
          reviewDueDate: newAssignment.due_at,
          reviewStatus: 0,
          reviewCanvasId: newAssignment.id,
          graded: false,
          name: assignmentName,
          courseId: parseInt(courseId),
        }
        responseHandler.response200(res, assignment);
        break;
      default:
        throw new Error("Invalid HTTP method");
    }
  } catch (err) {
    responseHandler.response400(res, err);
  }
};


async function createReviewAssignment(token, courseId, assignmentName, prName, prDueDate, prGroup, rubric) {
  const data = {
    assignment: { 
      name: prName,
      due_at: prDueDate, //"2021-05-01T11:59:00Z"
      description: "Peer Review Assignment for " + assignmentName,
      published: true,
      assignment_group_id: prGroup,
      points: rubric.points_possible,
      submission_types: [ "external_tool" ],
      external_tool_tag_attributes: {
        url: 'http://localhost:8081',
        new_tab: true,
        external_data: '',
        content_type: 'ContextExternalTool',
      }
    }
  }
  const response = await axios.post(canvas + "courses/" + courseId + "/assignments", data, {
    headers: {'Authorization': `Bearer ${token}`}
  })
  console.log(response)
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
  }).then(res => console.log(res))
  const assignment = {
    reviewDueDate: newAssignment.due_at,
    reviewStatus: 0,
    reviewCanvasId: newAssignment.id,
    graded: false,
    name: assignmentName,
    courseId: parseInt(courseId),
  }
  return assignment
}