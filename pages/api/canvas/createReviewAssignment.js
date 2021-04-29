const axios = require("axios")
export const config = {
  api: {
    bodyParser: false,
  },
}

const canvas = process.env.CANVAS_HOST;
const token = process.env.CANVAS_TOKEN;
const launch_url = process.env.LAUNCH_URL;
const resource_link_id = process.env.RESOURCE_LINK_ID;
const content_id = process.env.CONTENT_ID;
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
            points_possible: rubric.points_possible,
            submission_types: [ "external_tool" ],
            external_tool_tag_attributes: {
              url: launch_url,
              new_tab: true,
              resource_link_id: resource_link_id,
              external_data: '',
              content_type: 'ContextExternalTool',
              content_id: content_id
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
