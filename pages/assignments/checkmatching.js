import React, { useState, useEffect } from "react";
import Container from "../../components/container";
import Tree from "../../components/tree";
import Button from "@material-ui/core/Button";
import sampleData from "../../sample_data/ensureSufficientReviews";
import { ensureSufficientReviews } from "../api/AlgCalls.js";
import { useRouter } from 'next/router';
import { useUserData } from "../../components/storeAPI";
import StudentViewOutline from '../../components/studentViewOutline';
import canvasSubs from "../../sample_data/submissions";
const axios = require("axios");

function CheckMatching(props) {
  const { userId, courseId, courseName, assignment } = useUserData();
  const [graders, setGraders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [matching, setMatching] = useState([]);
  const router = useRouter();
  const { assignmentId, rubricId } = router.query;

  async function postSubmissionsFromData() {
    let nullGroups = canvasSubs.filter(x => x.groupId == null);
    console.log({nullGroups})
    await axios.post(`/api/uploadSubmissions?type=multiple`, nullGroups).catch(error => {
      console.log(error);
    });
    // post peer matchings
    const peerMatchings = nullGroups.map(sub => {
      return {
        matchingType: "initial",
        review: {"reviewBody":{"scores":[[10,"Arbitrary grade."],[10,"Arbitrary grade."],[10,"Arbitrary grade."]],"comments":""}},
        reviewReview: null,
        assignmentId: sub.assignmentId,
        submissionId: sub.submitterId,
        userId: 124720
      }
    })
    console.log("POST peer matchings", peerMatchings);
    await axios.post(`/api/peerReviews?type=multiple`, peerMatchings)
    .then(res => console.log("res", res))
    .catch(err => {
      console.log(err);
      // errs.push('Peer Matchings not posted');
    });
  }

  useEffect(() => {
    Promise.all([axios.get(`/api/canvas/users?courseId=${courseId}`),axios.get(`/api/peerReviews?done=true&assignmentId=${assignmentId}`),axios.get(`/api/peerReviews?assignmentId=${assignmentId}`),axios.get(`/api/rubrics/${rubricId}`)]).then(data => {
      // console.log({data});
      const usersRes = data[0].data;
      const completeReviewsRes = data[1].data;
      const allMatchingsRes = data[2].data;
      const rubricRes = data[3].data.data;

      let tempGraders, tempReviews, tempMatching;
      tempGraders = tempReviews = tempMatching = [];
      if (usersRes && completeReviewsRes && allMatchingsRes) {
        let justGraders = usersRes.data.filter(user => user.enrollment == "TaEnrollment");
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
      const matchings = await ensureSufficientReviews(
        graders,
        reviews,
        matching
      );
      setAdditionalMatchings(matchings);
      console.log({matchings});
    })();
  }, [graders, reviews, matching]);

  return (
    <div className="Content">
      <Container name="Additional Matches">
        <Button onClick={() => postSubmissionsFromData()}>manually post submissions from data</Button>
        <Tree response={additionalMatchings} />
      </Container>
      <StudentViewOutline isStudent={props.ISstudent} SetIsStudent={props.SetIsStudent} />
    </div>
  );
  // }
}

export default CheckMatching;
