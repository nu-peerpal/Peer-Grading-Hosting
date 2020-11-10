const axios = require("axios");
const { server } = require("../config/index.js");

const postAnnouncements = () => {
  const announcements = [
    { announcement: "This is an announcement.", courseId: 1 },
    { announcement: "The deadline has been extended", courseId: 1 },
    { announcement: "An announcement for course 2", courseId: 2 },
  ];
  return axios.post(`${server}/api/announcements?type=multiple`, announcements);
};

module.exports = postAnnouncements;
