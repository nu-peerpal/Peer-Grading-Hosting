const axios = require("axios");
const { server } = require("../config/index.js");

const postSubmissions = () => {
  const submissions = [
    {
      id: 1,
      assignmentId: 1,
      canvasId: 10,
      grade: -1,
      report: {},
      s3Link: "",
      groupId: 1,
    },
    {
      id: 2,
      assignmentId: 1,
      canvasId: 11,
      grade: -1,
      report: {},
      s3Link: "",
      groupId: 2,
    },
    {
      id: 3,
      assignmentId: 2,
      canvasId: 12,
      grade: 92,
      report: {},
      s3Link: "",
      groupId: 3,
    },
  ];
  return axios.post(`${server}/api/submissions?type=multiple`, submissions);
};

module.exports = postSubmissions;
