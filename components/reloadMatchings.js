import React, { useState, useEffect } from 'react';
import { useUserData } from "./storeAPI";
import Button from "@material-ui/core/Button";
import MatchingCell from "./matchingCell";
import styles from "../pages/assignments/matching/matching.module.scss";
const axios = require("axios");


function ReloadMatchings(props) {
    const { userId, courseId, revertFromStudent, savedStudentId } = useUserData();
    const [matchedUsers, setMatchedUsers] = useState([]);
    const [matchedSubs, setMatchedSubs] = useState([]);
    const [subFirstView, setSubFirstView] = useState(true); // true = submission first, false = reviewer first
    const PRs = props.matchings;
    useEffect(() => {
        axios.get(`/api/users`).then(userData => {
            let users = userData.data.data;
            console.log({users})
            let tempUser;
            let subBuckets = {};
            let userBuckets = {};
            console.log({PRs})
            PRs.forEach(review => {
                tempUser = users.filter(user => user.canvasId == review.userId);
                tempUser = tempUser[0];
                console.log({users})
                if (userBuckets[tempUser.canvasId]) {
                    userBuckets[tempUser.canvasId]["submissions"].push(review.submissionId);
                } else {
                    userBuckets[tempUser.canvasId] = {
                        name: tempUser["firstName"] + " " + tempUser["lastName"],
                        enrollment: tempUser["enrollment"],
                        submissions: [review.submissionId]
                      };
                }

                if (subBuckets[review.submissionId]) {
                    subBuckets[review.submissionId].push({
                        name: tempUser.firstName + " " + tempUser.lastName,
                        id: tempUser.canvasId});
                } else {
                    subBuckets[review.submissionId] = [{
                        name: tempUser.firstName + " " + tempUser.lastName,
                        id: tempUser.canvasId}];
                }
            })
            setMatchedUsers(userBuckets);
            setMatchedSubs(subBuckets);


            console.log({subBuckets});
            console.log({userBuckets});
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