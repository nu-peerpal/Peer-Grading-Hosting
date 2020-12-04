const axios = require("axios");
const { server } = require("../config/index.js");

const postSubmissions = () => {
  const submissions = [
    {
      id: 1,
      assignmentId: 1,
      canvasId: 10,
      grade: -1,
      report: {
        reportBody: `# Submission Report (Grade: 50)\n\n<submission id="1" />\n\n
          |        Rubric        | TA Review 1 [[?]][1] | Peer Review 1 
          [[?]][2] |\n| :------------------: | :------------------: 
          | :------------------: | \n|       Content        |      
          6 [[?]][3]      |      6 [[?]][4]      |\n|   Writing Quality    
          |      4 [[?]][5]      |      4 [[?]][6]      |\n|        
          Total         |          50          |          50          
          |\n\n[1]: # "T\n​\n​r\n​\n​y\n​\n​ \n​\n​h\n​\n​a\n​\n​r\n​\n​d\n​\n​e\n​\n​r"\n[2]: 
          # "T\n​\n​r\n​\n​y\n​\n​ \n​\n​h\n​\n​a\n​\n​r\n​\n​d\n​\n​e\n​\n​r"\n[3]: # "okay"
          \n[4]: # "okay"\n[5]: # "bad"\n[6]: # "bad"`,
      },
      s3Link: "",
      groupId: 1,
    },
    {
      id: 2,
      assignmentId: 1,
      canvasId: 11,
      grade: -1,
      report: {},
      s3Link: "",
      groupId: 2,
    },
    {
      id: 3,
      assignmentId: 2,
      canvasId: 12,
      grade: 92,
      report: {},
      s3Link: "",
      groupId: 3,
    },
  ];
  return axios.post(`${server}/api/submissions?type=multiple`, submissions);
};

module.exports = postSubmissions;
