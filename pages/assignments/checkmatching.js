import React, { useState, useEffect } from "react";
import Container from "../../components/container";
import Tree from "../../components/tree";
import Button from "@material-ui/core/Button";
import styles from "../assignments/matching/matching.module.scss";
import sampleData from "../../sample_data/ensureSufficientReviews";
import { ensureSufficientReviews } from "../api/AlgCalls.js";
import { useRouter } from 'next/router';
import { useUserData } from "../../components/storeAPI";
import StudentViewOutline from '../../components/studentViewOutline';
import ReloadMatchings from "../../components/reloadMatchings";
import canvasSubs from "../../sample_data/submissions";
const axios = require("axios");

function CheckMatching(props) {
  const { userId, courseId, courseName, assignment } = useUserData();
  const [graders, setGraders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [matching, setMatching] = useState([]);
  const [allMatchings, setAllMatchings] = useState([]);
  const [peerReviews, setPeerReviews] = useState([]);
  const [matchingGrid, setMatchingGrid] = useState([]);
  const [response, setResponse] = useState();
  const [students, setStudents] = useState();
  const router = useRouter();
  const { assignmentId, rubricId, assignmentName } = router.query;

  // async function postSubmissionsFromData() {
  //   let nullGroups = canvasSubs.filter(x => x.groupId == null);
  //   console.log({nullGroups})
  //   await axios.post(`/api/uploadSubmissions?type=multiple`, nullGroups).catch(error => {
  //     console.log(error);
  //   });
  //   // post peer matchings
  //   const peerMatchings = nullGroups.map(sub => {
  //     return {
  //       matchingType: "initial",
  //       review: null,
  //       reviewReview: null,
  //       assignmentId: sub.assignmentId,
  //       submissionId: sub.submitterId,
  //       userId: 124720
  //     }
  //   })
  //   console.log("POST peer matchings", peerMatchings);
  //   await axios.post(`/api/peerReviews?type=multiple`, peerMatchings)
  //   .then(res => console.log("res", res))
  //   .catch(err => {
  //     console.log(err);
  //     // errs.push('Peer Matchings not posted');
  //   });
  // }

  function incrementStep() {
    // Notify TA when TA reviews are assigned/ready to be completed
    Promise.all([
      axios.patch(`/api/assignments/${assignmentId}`, {reviewStatus: 5}),
      axios.post(`/api/sendemail?type=taReviewAssignment&courseId=${courseId}`, {
        userId: graders[0],
        subject: 'TA Review Assignment',
        message: `TA reviews for assignment ${assignmentName} are ready to be completed.`
      })
    ]).then(res => {console.log('res:',res)
        setResponse('Successfully incremented step')}).catch(err => console.log('err:',err))

  }
  async function handleSubmit() {
    // post peer matchings
    console.log("POST peer matchings", additionalMatchings);
    await axios.post(`/api/peerReviews?type=multiple`, additionalMatchings)
    .then(res => {
      console.log("res", res);
      axios.patch(`/api/assignments/${assignmentId}`, {reviewStatus: 5});

      // Notify TA when additional matches are assigned
      axios.post(`/api/sendemail?&type=additionalMatches&courseId=${courseId}`, {
        userId: graders[0],
        subject: 'Additional Matches',
        message: `${additionalMatchings.length} additional matches have been assigned.`
      }).then(res => {console.log('res:',res)
        setResponse('Successfully incremented step')}).catch(err => console.log('err:',err))

      setResponse('Submitted successfully.')})
    .catch(err => {
      console.log(err);
      setResponse('An error occurred:' + err);
      // errs.push('Peer Matchings not posted');
    });

  }

  useEffect(() => {
    Promise.all([axios.get(`/api/canvas/users?courseId=${courseId}`),axios.get(`/api/peerReviews?done=true&assignmentId=${assignmentId}`),axios.get(`/api/peerReviews?assignmentId=${assignmentId}`),axios.get(`/api/rubrics/${rubricId}`)]).then(data => {
      // console.log({data});
      const usersRes = data[0].data;
      const completeReviewsRes = data[1].data;
      const allMatchingsRes = data[2].data;
      setAllMatchings(allMatchingsRes.data);
      const rubricRes = data[3].data.data;

      // find who didn't complete their PRs
      let studentList = [];
      allMatchingsRes.data.forEach(match => {
        if (!match.review) { // if match doesn't exist, find the user and add to list
          let foundUser = usersRes.data.find(user => user.canvasId == match.userId);
          if (foundUser && foundUser.enrollment == "StudentEnrollment") {
            let name = foundUser.firstName + " " + foundUser.lastName;
            if (!studentList.includes(name)) {
              studentList.push(name);
            }
          }
        }
      })
      setStudents(studentList);

      let tempGraders, tempReviews, tempMatching;
      tempGraders = tempReviews = tempMatching = [];
      if (usersRes && completeReviewsRes && allMatchingsRes) {
        let justGraders = usersRes.data.filter(user => (user.enrollment == "TaEnrollment" || user.enrollment == "InstructorEnrollment"));
        tempGraders = justGraders.map(user => user.canvasId);
        tempReviews = completeReviewsRes.data.map(
          ({ submissionId, userId, review }) => {
            let simpleReview = review.reviewBody.scores.map((row, index) => {
              let percent = Math.round((row[0]/rubricRes.rubric[index]["points"])*100)/100;
              return [percent, row[1]]
            });

            return [userId, submissionId, simpleReview]} // format as algorithm input
        );
        tempMatching = allMatchingsRes.data.map(({ submissionId, userId }) => [
          userId,
          submissionId
        ]); // format as algorithm input
      }
      tempGraders.sort(function(a, b){return a-b});
      tempReviews.sort(function(a, b){return a[0]-b[0]})
      // sort first by userid, then by submission id
      let cmp = function(a,b) {
        if (a>b) return +1;
        if (a<b) return -1;
        return 0;
      }
      tempMatching.sort(function(a, b){return cmp(a[0],b[0]) || cmp(a[1],b[1])})
      setGraders(tempGraders);
      setReviews(tempReviews);
      setMatching(tempMatching);
      return () => { // if component isn't mounted
        setGraders([]);
        setReviews([]);
        setMatching([]);
      };
    })
  }, []);

  
  const [additionalMatchings, setAdditionalMatchings] = useState([]);
  useEffect(() => {
    (async () => {
      // console.log('alg inputs:')
      // console.log({graders}, {reviews}, {matching})
      if (graders.length!=0) {
        const matchings = await ensureSufficientReviews( // returns [TA_id, submission_id]
          graders,
          reviews,
          matching
        );
        if (matchings) {
          let newMatchings = [];
          console.log({allMatchings})
          matchings.forEach(match => {
            newMatchings.push({
              assignmentId: assignmentId,
              assignmentSubmissionId: null,
              matchingType: "additional",
              review: null,
              reviewReview: null,
              submissionId: match[1],
              userId: match[0]
            });
            setPeerReviews(newMatchings);
            setAdditionalMatchings(newMatchings);
            console.log({matchings});
          })
        } 
      } else {
        console.log('Algorithm success. No additional matches found.')
      }
      //   // find all submission PRs assigned. could be used for detecting who didn't submit
      //   matchings.forEach(match => {
      //     let subMatched = allMatchings.filter(x => (x.assignmentId == assignmentId && x.submissionId == match[1]));
      //     subMatched.forEach(matching => {
      //       dbMatchings.push(matching);
      //     })
      //   });
      //   setPeerReviews(dbMatchings);
      //   setAdditionalMatchings(matchings);
      //   console.log({matchings});
      // }
    })();
  }, [graders, reviews, matching]);

  return (
    <div className="Content">
      <Container name="Additional Matches">
        {/* <Tree response={additionalMatchings} /> */}
        <div className={styles.matching}>
          Students that haven't submitted Peer Reviews: 
          <div>{String(students)}</div>
          <br />
          <br />
          <ReloadMatchings matchings={peerReviews} setMatchingGrid={setMatchingGrid}/>
          Additional Matching[s]:
          {/* <ReloadMatchings matchings={peerReviews} setMatchingGrid={setMatchingGrid}/>
          Assigned Reviews (may or may not be completed): */}
          <div className={styles.matchingGrid}>
            {matchingGrid}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }} >
          {additionalMatchings.length == 0 ? 
            <Button onClick={incrementStep}>confirm no new matchings needed</Button>
            : <Button disabled={additionalMatchings.length == 0} onClick={() => handleSubmit()}>Create Additional Reviews</Button>
          }
            {response}
        </div>
      </Container>
      <StudentViewOutline isStudent={props.ISstudent} SetIsStudent={props.SetIsStudent} />
    </div>
  );
  // }
}

export default CheckMatching;
