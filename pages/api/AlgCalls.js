const axios = require("axios");

// ToDo: change input from json to parameters and form json
//       create filters to replace tuples with arrays


// algName: String
// algInput: object with parameters correctly named
async function callAlg(algName,algInput) {

  // convert camelCase to snakeCase
  const alg_input = _.mapKeys(algInput,(v,k) => _.snakeCase(k))

  console.log(`calling ${algName}${Object.keys(alg_input)}`);

  const response = await axios
    .post(
      `https://axmdfan1og.execute-api.us-east-1.amazonaws.com/dev/${algName}`,
      alg_input
    )
    .catch(error => {
      console.log({error});
      return {
        success:false,
        log:'alg call failed'
      };
    })

  if (response.status !== 200) {
    console.log("failed call");
    return {
      success:false,
      log:response.status
    };
  }

  const alg_output = response.data.response;

  if (!alg_output.success) {
    console.log("failed alg");
    console.log(alg_output.log);
  }

  // convert snakeCase back to camelCase
  return _.mapKeys(alg_output,(v,k) => _.camelCase(k));
}

async function peerMatch(graders, peers, submissions, peerLoad, graderLoad) {
  return await callAlg("peerMatch",{graders,peers,submissions,peerLoad,GraderLoad});
}

async function ensureSufficientReviews(graders, reviews, matching) {
  return await callAlg("ensureSufficientReviews",{graders,reviews,matching});
}

async function submissionReports(graders, reviews, rubric, numRounds = 20, bonus = 1.5) {
  return await callAlg("submissionReports",{graders,reviews,rubric,numRounds,bonus});
}


async function reviewReports(graders, reviews, rubric, reviewRubric) {
  return await callAlg("reviewReports",{graders,reviews,rubric,reviewRubric});
}

module.exports = {
  peerMatch,
  ensureSufficientReviews,
  submissionReports,
  reviewReports
};
