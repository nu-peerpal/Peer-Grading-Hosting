import React, { useState, useEffect } from 'react';
import { useUserData } from "./storeAPI";
import Button from "@material-ui/core/Button";
import MatchingCell from "./matchingCell";
import { useRouter } from 'next/router';
import styles from "../pages/assignments/matching/matching.module.scss";
const axios = require("axios");
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function ReloadMatchings(props) {
    const { userId, courseId, revertFromStudent, savedStudentId } = useUserData();
    const [matchedUsers, setMatchedUsers] = useState([]);
    const [matchedSubs, setMatchedSubs] = useState([]);
    const [subFirstView, setSubFirstView] = useState(true); // true = submission first, false = reviewer first
    const [completedReviewers, setCompletedReviewers] = useState([]);
    const [userCompletions, setUserCompletions] = useState({});
    const [submissionMap, setSubmissionMap] = useState([]);
    const PRs = props.matchings;
    const router = useRouter()
    let {assignmentId, assignmentName} = router.query;

    console.log('Peer Reviews:',PRs);

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
            console.log('subMap:',subMap)
            console.log('Peer Reviews:',PRs);
            let prProgress = {};
            let completedArray = [];
            let notCompletedArray = [];
            let completedSubmissionIds = [];
            let completedUserIds = [];
            // console.log('subBuckets:',subBuckets);
            PRs.forEach(review => {
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
                  prProgress[review.submissionId] = { completed: 1, total: 1, completedReviewers: [] }
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
                if (userBuckets[tempUser.canvasId]) {
                    userBuckets[tempUser.canvasId]["submissions"].push(sub);
                } else {
                    userBuckets[tempUser.canvasId] = {
                        name: tempUser["firstName"] + " " + tempUser["lastName"],
                        enrollment: tempUser["enrollment"],
                        submissions: [sub]
                      };
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

            console.log('userCompletions:',userCompletions);

            setUserCompletions(userCompletions);
            setSubmissionMap(subMap);

            // for (var j = 0; j < notCompletedSubmissionIds.length; j++)
            //  if subMap[notCompletedSubmissionIds[j]].includes(props.submission) {
            //      if (props.peers[i]["id"] == notCompletedUserIds[j])
            //          formattedPeersNotCompleted += props.peers[i]["name"]
            // }


            console.log('completedArray:',completedArray);
            console.log('completedSubmissionIds:',completedSubmissionIds);
            console.log('completedUserIds:',completedUserIds);

            // remove duplicates
            let newCompletedArray = [...new Set(completedArray)];
            setCompletedReviewers(newCompletedArray);
            console.log('newCompletedArray:',newCompletedArray);

            // Trying to iterate through subBuckets object

            // for (const [progress, reviewers] of Object.entries(subBuckets)) {
            //   for (var i = 0; i < reviewers.length; i++) {
            //     if (!newCompletedArray.includes(reviewers[i]["id"]) && progress[0] != progress[1]) {
            //       notCompletedArray.push(reviewers[i]["name"])
            //     }
            //   }
            // }

            // for (const subKey of Object.keys(subBuckets)) {
            //   for (var i = 0; i < subKey.reviewers.length; i++) {
            //     if (!newCompletedArray.includes(subKey.reviewers[i]["id"]) && subKey.progress[0] != subKey.progress[1]) {
            //       notCompletedArray.push(subKey.reviewers[i]["name"])
            //     }
            //   }
            // }

            // console.log('notCompletedArray:',notCompletedArray)
            
            console.log('prProgress:',prProgress);
            setMatchedUsers(userBuckets);
            setMatchedSubs(subBuckets);
            console.log('subBuckets:',subBuckets);


            // console.log({subBuckets});
            // console.log({userBuckets});
            // create the grid that will show the matchings
            var mg = []
            // if they want to see submissions first
            if (subFirstView) {
                for (var obj in subBuckets) {
                mg.push(<MatchingCell subFirstView={subFirstView} key={obj} submission={obj} peers={subBuckets[obj].reviewers} progress={subBuckets[obj].progress} completedReviewers={newCompletedArray} prProgress={prProgress} submissionMap={subMap} submissionId={subBuckets[obj].submissionId} />)
                // mg.push(<LinearWithValueLabel />)
                }
            }
            else{
                for (var obj in userBuckets) {
                mg.push(<MatchingCell subFirstView={subFirstView} key={obj} reviewer={userBuckets[obj]["name"]} submissions={userBuckets[obj]["submissions"]} />)
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
              mg.push(<MatchingCell subFirstView={subFirstView} key={obj} submission={obj} peers={matchedSubs[obj]} />)
            }
          }
          else{
            for (var obj in matchedUsers) {
              mg.push(<MatchingCell subFirstView={subFirstView} key={obj} reviewer={matchedUsers[obj]["name"]} submissions={matchedUsers[obj]["submissions"]} />)
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

// Progress bar 

let MIN = 0
let MAX = 5
// Function to normalise the values (MIN / MAX could be integrated)
const normalise = value => (value - MIN) * 100 / (MAX - MIN);

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="50%" mr={1}>
        {/* <LinearProgress variant="determinate" {...props} /> */}
        <LinearProgress variant="determinate" value={normalise(props.value)} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value,
        )}`}</Typography>
      </Box>
    </Box>
  );
}

// LinearProgressWithLabel.propTypes = {
//   /**
//    * The value of the progress indicator for the determinate and buffer variants.
//    * Value between 0 and 100.
//    */
//   // value: PropTypes.number.isRequired,
//   value: prProgress[review.submissionId].completed
// };

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});

function LinearWithValueLabel() {
  const classes = useStyles();
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      // setProgress((prevProgress) => (prevProgress >= prProgress[review.submissionId].total ? prProgress[review.submissionId].total : prevProgress + prProgress[review.submissionId].completed));
      setProgress((prevProgress) => (prevProgress >= 5 ? 5 : prevProgress + 1));
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className={classes.root}>
      <LinearProgressWithLabel value={progress} />
    </div>
  );
}

// LinearProgressWithLabel(LinearProgressWithLabel.propTypes);
// LinearWithValueLabel();

// End of progress bar


export default ReloadMatchings;