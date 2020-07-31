import axios from "axios"


// ToDo: change input from json to parameters and form json
//       create filters to replace tuples with arrays

function formJson(params){
    var len = params.length
    var j = {}
    for(var i = 0; i<len; i++){
        j[params[i][0]] = params[i][1]
    }
    return j
}


function peerMatch (graders, peers, submissions, peer_load, grader_load){
    var json  = formJson([["graders",graders],["peers",peers],["submissions",submissions], ["peer_load",peer_load], ["grader_load",grader_load]])
    return axios.post('https://axmdfan1og.execute-api.us-east-1.amazonaws.com/dev/peerMatch', json)
    .then((response) => {
        console.log(response)
        if (response.status !== 200){
            console.log('failed call')
            return response.status
        }
        response = response.data
        if (response.response.success) {
  //          console.log('response',response.response.matching)
            return response.response.matching
        }
        else{
            console.log('failed alg')
            return response.log

        }
    }, (error) => {
        console.log(error)})
    }
    
function ensureSufficientReviews (graders, reviews, matching){
    var json  = formJson([["graders", graders], ["reviews", reviews], ["matching", matching]])
    return axios.post('https://axmdfan1og.execute-api.us-east-1.amazonaws.com/dev/ensureSufficientReviews', json)
    .then((response) => {
        console.log(response)
        if (response.status !== 200){
            console.log('failed call')
            return response.status
        }
        response = response.data
        if (response.response.success) {
      //      console.log('response',response.response.additional_matching)
            return response.response.additional_matching
        }
        else{
            console.log('failed alg')
            return response.log
        }
    }, (error) => {
        console.log(error)})
    }



function submissionReports (graders, reviews, rubric, num_rounds=20, bonus=0.0){
    var json = formJson([["graders", graders], ["reviews", reviews], ["rubric", rubric], ["num_rounds",num_rounds],["bonus",bonus]])
    return axios.post('https://axmdfan1og.execute-api.us-east-1.amazonaws.com/dev/submissionReports', json)
    .then((response) => {
        console.log(response)
        if (response.status !== 200){
            console.log('failed call')
            return response.status
        }
        response = response.data
        if (response.response.success) {
    //        console.log("response", [response.response.submission_grades, response.response.submission_reports])
            return [response.response.submission_grades, response.response.submission_reports]
        }
        else{
            console.log("failed alg")
            return response.log
        }
    }, (error) => {
        console.log(error)})
}
function reviewReports (graders, reviews, rubric){
    var json = formJson([["graders", graders], ["reviews", reviews], ["rubric", rubric]])
    return axios.post('https://axmdfan1og.execute-api.us-east-1.amazonaws.com/dev/reviewReports', json)
    .then((response) => {
        console.log(response)
        if (response.status !== 200){
            console.log('failed call')
            return response.status
        }
        response = response.data
        if (response.response.success) {
     //       console.log('response',[response.response.review_grades, response.response.review_reports])
            return [response.response.review_grades, response.response.review_reports]
        }
        else{
            console.log("failed alg")
            return response.log
        }
    }, (error) => {
        console.log(error)})
    }

export { peerMatch, ensureSufficientReviews, submissionReports, reviewReports}