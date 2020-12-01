const { reviewReports } = require("../pages/api/AlgCalls.mjs");

// const PRS = [
//   { name: "Peer Review Assignment 3: Online Learning", info: "Due 1/12" },
// ];
// const LIST = [
//   { name: "Grade User 1s Submission", info: "Assignment 2: Bid Analysis" },
//   { name: "Grade User 2s Submission", info: "Assignment 2: Bid Analysis" },
//   { name: "Grade User 3s Submission", info: "Assignment 2: Bid Analysis" },
//   { name: "Peer Matching", info: "Assignment 4" },
// ];

const reviewData = {
  graders: [3, 1, 2], // TA instructors to compare against
  reviews: [
    [
      11, // grader
      112, // grade receiver
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      11,
      118,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      12,
      119,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      12,
      114,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      13,
      112,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      13,
      118,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      14,
      113,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      14,
      120,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      15,
      119,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      15,
      114,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      16,
      115,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      16,
      113,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      17,
      118,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      17,
      116,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      18,
      114,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      18,
      111,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      19,
      113,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      19,
      117,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      20,
      117,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      20,
      113,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      1,
      114,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      2,
      118,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      3,
      113,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      1,
      115,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      2,
      120,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      2,
      111,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      3,
      116,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
  ],
  rubric: [
    [50, "Content"],
    [50, "Writing Quality"],
  ],
};

// (async () => {
//   const res = await reviewReports(
//     reviewData.graders,
//     reviewData.reviews,
//     reviewData.rubric,
//   );
//   console.log(res);
// })();
