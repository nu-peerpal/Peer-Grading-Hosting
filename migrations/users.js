const axios = require("axios");
const { server } = require("../config/index.js");

const postUsers = () => {
  const users = [
    {
      id: 1,
      canvasId: 1,
      lastName: "Chung",
      firstName: "Andrew"
    },
    {
      id: 2,
      canvasId: 2,
      lastName: "Ramos",
      firstName: "Bradley"
    },
    {
      id: 3,
      canvasId: 3,
      lastName: "Liu",
      firstName: "Jonathan"
    },
    {
      id: 4,
      canvasId: 4,
      lastName: "Hartline",
      firstName: "Jason"
    }
  ];

  const courseEnrollments = [
    { id: 1, enrollment: "student", courseId: 1, userId: 1 },
    { id: 2, enrollment: "student", courseId: 1, userId: 2 },
    { id: 3, enrollment: "student", courseId: 1, userId: 3 },
    { id: 4, enrollment: "ta", courseId: 1, userId: 4 }
  ];

  return (async () => {
    const usersRes = await axios.post(
      `${server}/api/users?type=multiple`,
      users
    );
    const enrollmentsRes = await axios.post(
      `${server}/api/courseEnrollments?type=multiple`,
      courseEnrollments
    );
    return { data: [usersRes.data, enrollmentsRes.data] };
  })();
};

module.exports = postUsers;
