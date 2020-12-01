const axios = require("axios");
const { server } = require("../config/index.js");

const postAssignments = () => {
  const assignments = [
    {
      id: 1,
      appealsDueDate: "2020-11-30",
      assignmentDueDate: "2020-11-10",
      reviewDueDate: "2020-11-20",
      reviewStatus: 1,
      canvasId: 100,
      reviewCanvasId: 105,
      graded: false,
      name: "Homework 1 - Basic Programming",
      courseId: 1,
      rubricId: 1,
      reviewRubricId: 2,
    },
    {
      id: 2,
      appealsDueDate: "2020-11-15",
      assignmentDueDate: "2020-11-10",
      reviewDueDate: "2020-11-13",
      reviewStatus: 8,
      canvasId: 101,
      reviewCanvasId: 105,
      graded: true,
      name: "Homework 0 - Graded stuff",
      courseId: 1,
      rubricId: 1,
      reviewRubricId: 2,
    },
  ];
  return axios.post(`${server}/api/assignments?type=multiple`, assignments);
};

module.exports = postAssignments;
