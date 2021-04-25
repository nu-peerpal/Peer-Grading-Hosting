import React, { useState, useEffect } from "react";
import Container from "../../components/container";
import Submission from "../../components/submissionview";
import StudentViewOutline from '../../components/studentViewOutline';
import { useUserData } from "../../components/storeAPI";
import { useRouter } from 'next/router';

const getData = async url => {
  const res = await fetch(url);
  const resData = await res.json();
  return resData.data;
};

const PeerReview = (props) => {
  const { userId, courseId, courseName, assignment } = useUserData();
  const [submission, setSubmission] = useState("");
  const [rubric, setRubric] = useState([]);
  const [isDocument, setIsDocument] = useState(false);
  const [review, setReview] = useState();
  const router = useRouter()
  let { submissionId, id, rubricId, matchingId, subId } = router.query;

  useEffect(() => {
    (async () => {
      const [submission, matchingData, rubricData] = await Promise.all([
        getData(`/api/submissions?type=peerreview&submissionId=${submissionId}&assignmentId=${id}`),
        getData(`/api/peerReviews/${matchingId}`),
        getData(`/api/rubrics/${rubricId}`)
      ]);
      console.log('rubric data:',rubricData);
      console.log('matching data:',matchingData);
      if (submission.s3Link.includes('http')) { // if link, then view using iframe
        setIsDocument(true);
      }
      if (matchingData.review) {
        setReview(matchingData.review.reviewBody);
      }
      setSubmission(submission);
      setRubric(rubricData.rubric);
    })();
  }, []);

  return (
    <div className="Content">
      <Container name={"Grade Submission " + subId}>
      <Submission matchingId={matchingId} submission={submission} isDocument={isDocument} rubric={rubric} subId={subId} review={review} />
      </Container>
      <StudentViewOutline SetIsStudent={props.SetIsStudent} />
    </div>
  );
};



export default PeerReview;
