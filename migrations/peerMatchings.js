const axios = require("axios");
const { server } = require("../config/index.js");

const postPeerMatchings = () => {
  const peerMatchings = [
    {
      id: 1,
      matchingType: "initial",
      review: {},
      reviewReview: {},
      assignmentId: 1,
      submissionId: 1,
      userId: 1,
    },
    {
      id: 2,
      matchingType: "initial",
      review: {},
      reviewReview: {},
      assignmentId: 1,
      submissionId: 2,
      userId: 1,
    },
  ];
  return axios.post(`${server}/api/peerReviews?type=multiple`, peerMatchings);
};

module.exports = postPeerMatchings;
