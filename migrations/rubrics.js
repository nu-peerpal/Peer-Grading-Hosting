const axios = require("axios");
const { server } = require("../config/index.js");

const postRubrics = () => {
  const rubrics = [
    {
      id: 1,
      rubric: [
        [10, "Answer / Algorithm"],
        [10, "Proof Analysis"],
        [10, "Clarity"],
      ],
    },
    {
      id: 2,
      rubric: [
        [10, "Qualitative"],
        [10, "Quantitative"],
      ],
    },
  ];
  return axios.post(`${server}/api/rubrics?type=multiple`, rubrics);
};

module.exports = postRubrics;
