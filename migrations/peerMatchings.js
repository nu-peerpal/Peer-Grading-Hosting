const axios = require("axios");
const { server } = require("../config/index.js");

const postPeerMatchings = () => {
  const peerMatchings = [
    {
      id: 1,
      matchingType: "initial",
      review: {
        scores: [
          [
            9,
            "Great algorithm. Could use a little work on the implementation, but overall I feel like it's fine."
          ],
          [
            8,
            "Proof could be better, but took into consideration that it was a difficult question."
          ],
          [
            8.5,
            "Fairly clear: not much else to ask for, but it didn't surpass any expectations."
          ]
        ],
        comments: ""
      },
      reviewReview: null,
      assignmentId: 1,
      submissionId: 1,
      userId: 1
    },
    {
      id: 2,
      matchingType: "initial",
      review: null,
      reviewReview: null,
      assignmentId: 1,
      submissionId: 2,
      userId: 1
    }
  ];
  return axios.post(`${server}/api/peerReviews?type=multiple`, peerMatchings);
};

module.exports = postPeerMatchings;
