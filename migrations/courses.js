const axios = require("axios");
const { server } = require("../config/index.js");

const postCourses = () => {
  const courses = [
    {
      id: 1,
      active: true,
      canvasId: 300,
      courseName: "CS 111 - Fundamentals of Computer Programming",
    },
    {
      id: 2,
      active: true,
      canvasId: 301,
      courseName: "ASTRON 300",
    },
  ];
  return axios.post(`${server}/api/courses?type=multiple`, courses);
};

module.exports = postCourses;
