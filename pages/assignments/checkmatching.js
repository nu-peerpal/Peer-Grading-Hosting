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
import _ from "lodash";

function CheckMatching(props) {
  const { userId, courseId, courseName, assignment } = useUserData();
  const [graders, setGraders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [matching, setMatching] = useState([]);
  const [allMatchings, setAllMatchings] = useState([]);
  const [peerReviews, setPeerReviews] = useState([]);
  const [matchingGrid, setMatchingGrid] = useState([]);
  const [response, setResponse] = useState();
  const [students, setStudents] = useState(null);
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

      // // Notify TA when additional matches are assigned
      // axios.post(`/api/sendemail?&type=additionalMatches&courseId=${courseId}`, {
      //   userId: graders[0],
      //   subject: 'Additional Matches',
      //   message: `${additionalMatchings.length} additional matches have been assigned.`
      // }).then(res => {console.log('res:',res)
      //   setResponse('Successfully incremented step')}).catch(err => console.log('err:',err))

      setResponse('Submitted successfully.')})
    .catch(err => {
      console.log(err);
      setResponse('An error occurred:' + err);
      // errs.push('Peer Matchings not posted');
    });

  }

  useEffect(() => {
    if (!courseId) {
      console.log("checkmatching: courseId not set");
      return;
    }

    Promise.all([axios.get(`/api/users?courseId=${courseId}`),
      axios.get(`/api/peerReviews?assignmentId=${assignmentId}`),
      axios.get(`/api/rubrics/${rubricId}`)])
    .then(responses => {
      // console.log({data});

      const [users,allMatchings,rubric] = responses.map(res => res.data.data);

      const completeReviews = allMatchings
        .filter(({review}) => review && review.reviewBody.scores.length);

      setAllMatchings(allMatchings);

      // find who didn't complete their PRs

      const userLookup = _.keyBy(users, ({id}) => id);

      // find students with missing reviews
      const studentsWithMissingReviews = allMatchings
        .filter(({review,matchingType}) => !review && matchingType === "initial")
        .map(({userId}) => userLookup[userId])
        .map(({firstName,lastName}) => `${firstName} ${lastName}`);

      const countMissing = _.countBy(studentsWithMissingReviews,name => name)
      const missing = Object.entries(countMissing)
        .map(([name,count]) => `${name} (${count})`);


      setStudents(missing);


      // find graders in the matching
      const matchedGraders = _.uniq(allMatchings
        .filter(({matchingType}) => matchingType !== "initial")
        .map(({userId}) => userId)
      );

      if (!matchedGraders.length)
        console.log("warning, no matched graders");

      console.log({matchedGraders});

      setGraders(matchedGraders);

      // construct reviews
      const tempReviews = completeReviews
        .map(({ submissionId, userId, review, reviewReview }) => {
          let simpleReview;
          if (review) { // student review
            simpleReview = review.reviewBody.scores.map((row, index) => {
              let percent = Math.round((row[0]/rubric.rubric[index]["points"])*100)/100;
              return [percent, row[1]]
            });
          } else { // TA review
            simpleReview = reviewReview.instructorGrades.map(row => {
              let percent = Math.round((row.points/row.maxPoints)*100)/100;
              return [percent, row.comment]
            })
          }

          return [userId, submissionId, simpleReview]} // format as algorithm input
      );


      // construct matching.
      const tempMatching = allMatchings
        .map(({ submissionId, userId }) => [
          userId,
          submissionId
        ]); // format as algorithm input


      setReviews(tempReviews);
      setMatching(tempMatching);

    });

    return;
  }, [courseId]);


  const [additionalMatchings, setAdditionalMatchings] = useState([]);

  useEffect(() => {
    (async () => {
      console.log('alg inputs:')
      console.log({graders}, {reviews}, {matching})
      if (graders.length===0 || matching.length==0)
        return;

      const algOutput = await ensureSufficientReviews( // returns [TA_id, submission_id]
        graders,
        reviews,
        matching
      );

      if (!algOutput.success) {
        console.log('error running algorithm')
        return;
      }

      const matchings = algOutput.additionalMatching

      if (!matchings) {
        console.log('No additional matches found.');
        return;
      }

      console.log({allMatchings})
      let newMatchings = matchings
        .map(match => ({
          assignmentId: assignmentId,
          assignmentSubmissionId: null,
          matchingType: "additional",
          review: null,
          reviewReview: null,
          submissionId: match[1],
          userId: match[0]
        }));

      setPeerReviews(newMatchings);
      setAdditionalMatchings(newMatchings);
      console.log({matchings});

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
  },[graders, reviews, matching]);

  if (!students || !additionalMatchings) {
    console.log("not ready to render");
    return null;
  }

  return (
    <div className="Content">
      <Container name="Additional Matches">
        {/* <Tree response={additionalMatchings} /> */}
        <div className={styles.matching}>
          Students that haven't submitted Peer Reviews:
          <div><ol>{students.map(name => <li key={name}>{name}</li>)}</ol></div>
          <br />
          <br />
          <ReloadMatchings matchings={peerReviews} setMatchingGrid={setMatchingGrid}/>
          Additional Matching[s]:
          {/* <ReloadMatchings matchings={peerReviews} setMatchingGrid={setMatchingGrid}/>
          Assigned Reviews (may or may not be completed): */}
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
