import React, { useState, useEffect } from "react";
import Container from "../../components/container";
import Submission from "../../components/submissionview";
import StudentViewOutline from '../../components/studentViewOutline';
import { useUserData } from "../../components/storeAPI";

const getData = async url => {
  const res = await fetch(url);
  const resData = await res.json();
  return resData.data;
};

const PeerReview = (props) => {
  const { userId, courseId, courseName, assignment } = useUserData();
  const [submissionLink, setSubmissionLink] = useState("");
  const [rubric, setRubric] = useState([]);

  const submissionId = 1;
  const rubricId = 1;
  const groupId = 1;
  const assignmentId = 41;
  const rubricOne = {
    id: 1,
    rubric: [
      [10, "Answer / Algorithm"],
      [10, "Proof Analysis"],
      [10, "Clarity"],
    ],
  };
  const pdfUrl = "https://peerpal-submissions-test-bucket.s3.us-east-2.amazonaws.com/1618112012741ce6903b9f610f5d7.pdf";

  useEffect(() => {
    (async () => {
      const [submission, rubric] = await Promise.all([
        getData(`/api/submissions?groupId=?${groupId}&assignmentId=${assignmentId}`),
        getData(`/api/rubrics/${rubricId}`),
      ]);
      console.log("RUBRIC:",rubricOne);
      // setSubmissionLink(submission.s3Link);
      setRubric(rubricOne.rubric);
      setSubmissionLink(pdfUrl);
    })();
  }, []);

  return (
    <div className="Content">
      <Container name="Grade User 1's Submission">
        <Submission sublink={submissionLink} rubric={rubric} />
      </Container>
      <StudentViewOutline SetIsStudent={props.SetIsStudent} />
    </div>
  );
};

export default PeerReview;
