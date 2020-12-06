// holds sample data required for tagrading as stored in db
export const peerMatchings = [
  {
    userId: 1,
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
      comments: "Overall, fairly good"
    }
  },
  {
    userId: 2,
    review: {
      scores: [
        [
          7,
          "Great algorithm. Could use a little work on the implementation, but overall I feel like it's fine."
        ],
        [
          7.5,
          "Proof could be better, but took into consideration that it was a difficult question."
        ],
        [
          9.5,
          "Fairly clear: not much else to ask for, but it didn't surpass any expectations."
        ]
      ],
      comments: "Overall, fairly good"
    }
  },
  {
    userId: 3,
    review: {
      scores: [
        [
          10,
          "Great algorithm. Could use a little work on the implementation, but overall I feel like it's fine."
        ],
        [
          8.5,
          "Proof could be better, but took into consideration that it was a difficult question."
        ],
        [
          8,
          "Fairly clear: not much else to ask for, but it didn't surpass any expectations."
        ]
      ],
      comments: "Overall, fairly good"
    }
  }
];

export const assignmentRubric = [
  [10, "Answer / Algorithm"],
  [10, "Proof Analysis"],
  [10, "Clarity"]
];

export const reviewRubric = [
  [10, "Qualitative"],
  [10, "Quantitative"]
];
