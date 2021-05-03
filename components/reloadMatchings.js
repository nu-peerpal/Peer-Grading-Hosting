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
            PRs.forEach(review => {
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
                    subBuckets[sub].push({
                        name: tempUser.firstName + " " + tempUser.lastName,
                        id: tempUser.canvasId});
                } else {
                    subBuckets[sub] = [{
                        name: tempUser.firstName + " " + tempUser.lastName,
                        id: tempUser.canvasId}];
                }
            })
            setMatchedUsers(userBuckets);
            setMatchedSubs(subBuckets);


            // console.log({subBuckets});
            // console.log({userBuckets});
            // create the grid that will show the matchings
            var mg = []
            // if they want to see submissions first
            if (subFirstView) {
                for (var obj in subBuckets) {
                mg.push(<MatchingCell subFirstView={subFirstView} key={obj} submission={obj} peers={subBuckets[obj]} />)
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

export default ReloadMatchings;