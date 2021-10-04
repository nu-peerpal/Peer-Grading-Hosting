import React, { useState, useEffect } from 'react';
import { useUserData } from "./storeAPI";
import Button from "@material-ui/core/Button";
import MatchingCell from "./matchingCell";
import { useRouter } from 'next/router';
import styles from "../pages/assignments/matching/matching.module.scss";
const axios = require("axios");

function ReloadMatchings(props) {
    const { userId, courseId, revertFromStudent, savedStudentId } = useUserData();
    const [matchedUsers, setMatchedUsers] = useState([]);
    const [matchedSubs, setMatchedSubs] = useState([]);
    const [subFirstView, setSubFirstView] = useState(true); // true = submission first, false = reviewer first
    const [completedReviewers, setCompletedReviewers] = useState([]);
    const [userCompletions, setUserCompletions] = useState({});
    const [submissionMap, setSubmissionMap] = useState([]);
    const [userProgress, setUserProgress] = useState({});
    const [reviewerId, setReviewerId] = useState();
    const [completedSubmissionIds, setCompletedSubmissionIds] = useState([]);
    const [prProgress, setPrProgress] = useState({});
    const PRs = props.matchings;
    const router = useRouter()
    let {assignmentId, assignmentName} = router.query;

    useEffect(() => {
      Promise.all([axios.get(`/api/users`), axios.get(`/api/canvas/submissions?courseId=${courseId}&assignmentId=${assignmentId}`)]).then(userData => {
            let users = userData[0].data.data;
            let submissions = userData[1].data.data;
            console.log({submissions})
            let tempUser;
            let subBuckets = {};
            let userBuckets = {};
            let bucket;
            let subGroups = {};
            submissions.forEach(submission => { // sort submissions by {groupId: [...userIds]}
              if (!submission.groupId) {
                bucket = submission.submitterId;
              } else {
                bucket = submission.groupId;
              }
              if (subGroups[bucket]) {
                subGroups[bucket].push(submission.submitterId);
                subGroups[bucket].sort(function(a, b){return a-b})
              } else {
                subGroups[bucket] = [submission.submitterId];
              }
            });
            let tempGroup, tempSub, tempAid;
            for (let sub in submissions) { // grab group, find lowest group member, get aid
              if (!submissions[sub]["groupId"]) { // if null group, change to userId
                tempGroup = submissions[sub].submitterId;
              } else {
                tempGroup = submissions[sub]["groupId"];
              }
              tempSub = submissions.filter(sub => sub.submitterId == subGroups[tempGroup][0]);
              tempAid = tempSub[0].canvasId;
              submissions[sub]["canvasId"] = tempAid;
            }
            let subMap = {}; // set up object: {submissionId: [...user names]}
            submissions.forEach(sub => {
              let student = users.filter(x => x.canvasId == sub.submitterId)
              student = student[0].firstName + " " + student[0].lastName;
              if (subMap[sub.canvasId]) {
                subMap[sub.canvasId].push(student);
              } else {
                subMap[sub.canvasId] = [student];
              }
            });
            console.log({subMap})
            console.log('Peer Reviews:',PRs);
            let prProgress = {};
            let completedArray = [];
            let notCompletedArray = [];
            let completedSubmissionIds = [];
            let completedUserIds = [];
            let userProgress = {};
            let matchingsFromAppeals = [] // show matchings in appeals
            // console.log('subBuckets:',subBuckets);
            PRs.forEach(review => {

              if (review.matchingType == 'appeal') { 

                  matchingsFromAppeals.push({
                    assignmentId: review.assignmentId,
                    assignmentSubmissionId: review.submissionId,
                    matchingType: review.matchingType,
                    review: review.review,
                    reviewReview: review.reviewReview,
                    submissionId: review.submissionId,
                    userId: review.userId

                  })
              }

              if (userProgress[review.userId]) {
                userProgress[review.userId].total += 1;
                if (review.review) {
                  userProgress[review.userId].completed += 1
                  userProgress[review.userId].completedSubmissions.push(review.submissionId)
                } // case for TA possibly
              } else {
                if (review.review) {
                  userProgress[review.userId] = { completed: 1, total: 1, completedSubmissions: [review.submissionId] }
                } else {
                  userProgress[review.userId] = { completed: 0, total: 1, completedSubmissions: [] }
                } // case for TA possibly
              }


              if (prProgress[review.submissionId]) {
                prProgress[review.submissionId].total += 1;
                if (review.review) {
                  prProgress[review.submissionId].completed += 1
                  prProgress[review.submissionId].completedReviewers.push(review.userId)
                } else if (review.reviewReview) {
                  prProgress[review.submissionId].completed += 1
                  prProgress[review.submissionId].completedReviewers.push(reviewer.userId)
                }
              } else {
                if (review.review) {
                  prProgress[review.submissionId] = { completed: 1, total: 1, completedReviewers: [review.userId] }
                } else if (review.reviewReview) {
                  prProgress[review.submissionId] = { completed: 1, total: 1, completedReviewers: [review.userId] }
                } else {
                  prProgress[review.submissionId] = { completed: 0, total: 1, completedReviewers: [] }
                }
              };
                tempUser = users.filter(user => user.canvasId == review.userId);
                tempUser = tempUser[0];
                // console.log({users})
                let subGroupString = ""
                for (let k in subMap[review.submissionId]) {
                  subGroupString += subMap[review.submissionId][k]+", "
                }
                let sub = subGroupString.slice(0,-2);
                // add progress to user buckets
                // do another count for how many submissions a single reviewer did

                if (userBuckets[tempUser.canvasId]) {
                  let progressCaseTwo = 0;
                  if (review.review) progressCaseTwo = 1
                  userBuckets[tempUser.canvasId].progressCaseTwo[0] += progressCaseTwo
                  userBuckets[tempUser.canvasId].progressCaseTwo[1] += 1
                    // userBuckets[tempUser.canvasId].submissions.push(sub)
                    userBuckets[tempUser.canvasId].submissions.push({
                      submission: [sub],
                      id: review.submissionId
                    })
                    userBuckets[tempUser.canvasId].userId = review.userId
                } else {
                  let progressArrayCaseTwo = [];
                  if (review.review) progressArrayCaseTwo = [1,1]
                  else progressArrayCaseTwo = [0,1]
                    userBuckets[tempUser.canvasId] = {
                      progressCaseTwo: progressArrayCaseTwo,
                      name: tempUser["firstName"] + " " + tempUser["lastName"],
                      enrollment: tempUser["enrollment"],
                      submissions: [{
                        submission: [sub],
                        id: review.submissionId}]
                      
                    }
                }

                if (subBuckets[sub]) {
                  let progress = 0;
                  if (review.review) progress = 1
                  subBuckets[sub].progress[0] += progress
                  subBuckets[sub].progress[1] += 1
                    subBuckets[sub].reviewers.push({
                        name: tempUser.firstName + " " + tempUser.lastName,
                        id: tempUser.canvasId,
                      })
                    subBuckets[sub].submissionId = review.submissionId
  
                        
                } else {
                  let progressArray = [];
                  if (review.review) progressArray = [1,1]
                  else progressArray = [0,1] 
                    subBuckets[sub] = {
                      progress: progressArray, 
                      reviewers: [{
                        name: tempUser.firstName + " " + tempUser.lastName,
                        id: tempUser.canvasId}]
                      }
                }
                let userCompletions = {};
                // if user has not completed any peer reviews, they will not exist in dictionary
                if (review.review && review.matchingType == 'initial') {
                  completedArray.push(String(review.userId))
                  completedSubmissionIds.push(String(review.submissionId))
                  if (userCompletions[review.userId]) {
                    userCompletions[review.userId].push(review.submissionId);
                  } else {
                    userCompletions[review.userId] = [review.submissionId];
                  }
                } else if (review.reviewReview && review.matchingType == 'initial') {
                    // must be a TA
                  completedArray.push(String(review.userId))
                  if (userCompletions[review.userId]) {
                    userCompletions[review.userId].push(review.submissionId);
                  } else {
                    userCompletions[review.userId] = [review.submissionId];
                  }
                }
            })

            setUserCompletions(userCompletions);
            setSubmissionMap(subMap);
            setPrProgress(prProgress)
            setUserProgress(userProgress);
            setReviewerId(reviewerId);
            setCompletedSubmissionIds(completedSubmissionIds);
  
            // remove duplicates for completedSubmissionIds
            let newCompletedSubmissionIds = [...new Set(completedSubmissionIds)];
            setCompletedSubmissionIds(newCompletedSubmissionIds);

            setMatchedUsers(userBuckets);
            setMatchedSubs(subBuckets);

            // create the grid that will show the matchings
            var mg = []
            // if they want to see submissions first
            console.log({subBuckets})
            console.log({prProgress}) 
            if (subFirstView) {
                for (var obj in subBuckets) {
                mg.push(<MatchingCell subFirstView={subFirstView} key={obj} submission={obj} peers={subBuckets[obj].reviewers} progress={subBuckets[obj].progress} prProgress={prProgress} submissionMap={subMap} submissionId={subBuckets[obj].submissionId} />)
                }
            }
            else{
                for (var obj in userBuckets) {
                  // add all the props to send to matchingCell, need userId, userProgress array, pass info to matchingCell 
                mg.push(<MatchingCell subFirstView={subFirstView} key={obj} reviewer={userBuckets[obj]["name"]} submissions={userBuckets[obj]["submissions"]} progressCaseTwo={userBuckets[obj]["progressCaseTwo"]} userProgress={userProgress} reviewerId={userBuckets[obj].userId} completedSubmissionIds={newCompletedSubmissionIds} />)
                }
            }
            console.log({mg})
            props.setMatchingGrid(mg);
        })

    }, [PRs])

    useEffect(() => {
        if (matchedUsers && matchedSubs) {
            console.log('View toggled!');
          // create the grid that will show the matchings
          var mg = []
          // if they want to see submissions first
          if (subFirstView) {
            for (var obj in matchedSubs) {
              mg.push(<MatchingCell subFirstView={subFirstView} key={obj} submission={obj} peers={matchedSubs[obj].reviewers} progress={matchedSubs[obj].progress} prProgress={prProgress} submissionMap={submissionMap} submissionId={matchedSubs[obj].submissionId} />)
            }
          }
          else{
            for (var obj in matchedUsers) {
              mg.push(<MatchingCell subFirstView={subFirstView} key={obj} reviewer={matchedUsers[obj]["name"]} submissions={matchedUsers[obj]["submissions"]} progressCaseTwo={matchedUsers[obj]["progressCaseTwo"]} userProgress={userProgress} reviewerId={matchedUsers[obj].userId} completedSubmissionIds={completedSubmissionIds} />)
            }
          }
          console.log({mg})
          props.setMatchingGrid(mg);
        }
      },[subFirstView])

    return (
        <div>
            <Button onClick={() => setSubFirstView(!subFirstView)}>
            Toggle View
          </Button>
        </div>
    )
};

export default ReloadMatchings;