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

let new_rubric = [{"id":"_7361","description":"Gets the right answer","long_description":"2^50 is the right answer","points":20,"mastery_points":null,"ignore_for_scoring":null,"title":"Gets the right answer","criterion_use_range":true,
    "ratings":[{"description":"Full Marks","long_description":null,"id":"blank","criterion_id":"_7361","points":20},
    {"description":"No Marks","long_description":null,"id":"blank_2","criterion_id":"_7361","points":0}]},
  {"id":"34822_9291","description":"Explains why","long_description":"Some reasonable explanation of their reasoning.","points":20,"mastery_points":null,"ignore_for_scoring":null,"title":"Explains why","criterion_use_range":null,
    "ratings":[{"description":"Full Marks","long_description":null,"id":"34822_7501","criterion_id":"34822_9291","points":20},
    {"description":"No Marks","long_description":null,"id":"34822_4762","criterion_id":"34822_9291","points":0}]},
  {"id":"34822_6785","description":"Flatters professor","long_description":"Mentioning excellence of clarinet playing required for full points,.","points":60,"mastery_points":null,"ignore_for_scoring":null,"title":"Flatters professor","criterion_use_range":null,
    "ratings":[{"description":"Full Marks","long_description":null,"id":"34822_5970","criterion_id":"34822_6785","points":60},
    {"description":"No Marks","long_description":null,"id":"34822_9492","criterion_id":"34822_6785","points":0}]}]

module.exports = postRubrics;
