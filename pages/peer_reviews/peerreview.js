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
  const router = useRouter()
  let { submissionId, rubricId, matchingId } = router.query;

  useEffect(() => {
    (async () => {
      const [submission, rubricData] = await Promise.all([
        getData(`/api/submissions?type=peerreview&submissionId=${submissionId}`),
        getData(`/api/rubrics/${rubricId}`),
      ]);
      console.log({submission});
      if (submission.s3Link.includes('http')) { // if link, then view using iframe
        setIsDocument(true);
      }
      setSubmission(submission);
      setRubric(rubricData.rubric);
      // setSubmissionLink(pdfUrl);
    })();
  }, []);

  return (
    <div className="Content">
      <Container name={"Grade Submission " + submissionId}>
        <Submission sublink={submission.s3Link} matchingId={matchingId} submission={submission} isDocument={isDocument} rubric={rubric} />
      </Container>
      <StudentViewOutline SetIsStudent={props.SetIsStudent} />
    </div>
  );
};

export default PeerReview;
