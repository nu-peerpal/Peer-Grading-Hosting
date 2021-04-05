import React, { useState, useEffect } from "react";
import Container from "../../components/container";
import Submission from "../../components/submissionview";
import StudentViewOutline from '../../components/studentViewOutline';

const getData = async url => {
  const res = await fetch(url);
  const resData = await res.json();
  return resData.data;
};

const PeerReview = () => {
  const [submissionLink, setSubmissionLink] = useState("");
  const [rubric, setRubric] = useState([]);

  const submissionId = 1;
  const rubricId = 1;
  const rubricOne = {
    id: 1,
    rubric: [
      [10, "Answer / Algorithm"],
      [10, "Proof Analysis"],
      [10, "Clarity"],
    ],
  };
  const pdfUrl = "https://peer-grading-submissions.s3.us-east-2.amazonaws.com/becker-trellis-jcgs.pdf";

  useEffect(() => {
    (async () => {
      const [submission, rubric] = await Promise.all([
        getData(`/api/submissions/${submissionId}`),
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
      <StudentViewOutline />
    </div>
  );
};

export default PeerReview;
