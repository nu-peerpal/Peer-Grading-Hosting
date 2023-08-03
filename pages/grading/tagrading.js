import React, { useState, useEffect } from "react";
import Container from "../../components/container";
import TAsubmission from "../../components/TAgradingview";
import useSWR from "swr";
const axios = require("axios");
import StudentViewOutline from '../../components/studentViewOutline';
import { useUserData } from "../../components/storeAPI";
import { useRouter } from 'next/router';

const fetcher = url => fetch(url).then(res => res.json());

export const transformRubric = (rubric) =>
  rubric.map((row, index) => ({ maxPoints: row["points"], element: row["description"] }));


export const transformMatchings = (matchings, assignmentRubric) =>
  matchings.map(matching => {
    if (matching.review) {
      const reviewScoreComments = matching.review.reviewBody.scores;
      const transformedReview = reviewScoreComments.map(
        ([points, comment], i) => ({
          points,
          comment,
          maxPoints: assignmentRubric[i]["points"],
          element: assignmentRubric[i]["description"]
        })
      );
      // console.log(firstName,lastName,reviewScoreComments,transformedReview)
      return {
        userId: matching.userId,
        review: transformedReview,
        reviewReview: matching.reviewReview,
        matchingId: matching.id
      };
    } else {
      return {
        userId: matching.userId,
        review: matching.review,
        reviewReview: matching.reviewReview,
        matchingId: matching.id
      };
    }
  });


const TAGrading = (props) => {
  const { userId, courseId } = useUserData();
  const router = useRouter();
  const [rubric, setRubric] = useState(null);
  const [reviewRubric, setReviewRubric] = useState(null);
  const [peerMatchings, setPeerMatchings] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [isDocument, setIsDocument] = useState(false);
  const [presetComments, setPresetComments] = useState(['Great job!', 'Good but could use more detail', 'Missed the prompt']);
  let { matchingId, submissionId , id} = router.query;

  useEffect(() => {
    var assignmentRes, matchingsRes, usersRes;
    Promise.all([
      axios.get(`/api/assignments/${id}`),
      axios.get(`/api/users?courseId=${courseId}`),
      axios.get(`/api/peerReviews?assignmentId=${id}&submissionId=${submissionId}&done=true`),
      axios.get(`/api/submissions?type=peerreview&submissionId=${submissionId}&assignmentId=${id}`)
    ]).then(async (data) => {
      console.log({data})
      assignmentRes = data[0].data;
      usersRes = data[1].data;
      matchingsRes = data[2].data;
      setSubmission(data[3].data.data);
      if (data[3].data.data.s3Link.includes('http')){
        setIsDocument(true);
      }

      let rawRubric, tempRubric, tempReviewRubric;
      if (assignmentRes) {
        const [rubricRes, reviewRubricRes] = await Promise.all(
          [
            `/api/rubrics/${assignmentRes.data.rubricId}`,
            `/api/rubrics/${assignmentRes.data.reviewRubricId}`
          ].map(fetcher)
        );
        console.log('rubrics:', rubricRes,reviewRubricRes);
        rawRubric = rubricRes.data.rubric;
        tempRubric = transformRubric(rawRubric);
        tempReviewRubric = transformRubric(reviewRubricRes.data.rubric);
      }
      if (matchingsRes && usersRes && rawRubric.length > 0) {
        const peerMatchings = matchingsRes.data
          .filter(({matchingType}) => matchingType === "initial");
        let tempPeerMatchings = transformMatchings(peerMatchings, rawRubric, usersRes.data);
        console.log({rawRubric});
        console.log({tempPeerMatchings});
        setPeerMatchings(tempPeerMatchings);
        setRubric(tempRubric);
        setReviewRubric(tempReviewRubric);
      }

    })

  }, []);

  if (!rubric || !peerMatchings || !reviewRubric || !submission)
    return null;

  return (
    <div className="Content">
      <Container name="TA Grading">
        <TAsubmission
          matchingId={matchingId}
          assignmentRubric={rubric}
          reviewRubric={reviewRubric}
          peerMatchings={peerMatchings}
          submission={submission}
          isDocument={isDocument}
          presetComments={presetComments}
          setPresetComments={setPresetComments}
        />
        <StudentViewOutline isStudent={props.ISstudent} SetIsStudent={props.SetIsStudent} />
      </Container>
    </div>
  );
};

export default TAGrading;
