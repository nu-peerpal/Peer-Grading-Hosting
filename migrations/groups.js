const axios = require("axios");
const { server } = require("../config/index.js");

const postGroups = () => {
  const groups = [
    {
      id: 1,
      assignmentId: 1,
      canvasId: 20,
      userIds: [1, 2],
    },
    {
      id: 2,
      assignmentId: 1,
      canvasId: 21,
      userIds: [3, 4],
    },
  ];
  return axios.post(`${server}/api/groups?type=multiple`, groups);
};

module.exports = postGroups;
