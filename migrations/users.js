const axios = require("axios");
const { server } = require("../config/index.js");

const postUsers = () => {
  const users = [
    {
      id: 1,
      canvasId: 1,
      lastName: "Chung",
      firstName: "Andrew",
    },
    {
      id: 2,
      canvasId: 2,
      lastName: "Ramos",
      firstName: "Bradley",
    },
    {
      id: 3,
      canvasId: 3,
      lastName: "Liu",
      firstName: "Jonathan",
    },
    {
      id: 4,
      canvasId: 4,
      lastName: "Hartline",
      firstName: "Jason",
    },
  ];
  return axios.post(`${server}/api/users?type=multiple`, users);
};

module.exports = postUsers;
