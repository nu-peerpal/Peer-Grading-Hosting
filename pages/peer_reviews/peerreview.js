import React, { useState, useEffect } from "react";
import Container from "../../components/container";
import Submission from "../../components/submissionview";

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

  useEffect(() => {
    (async () => {
      const [submission, rubric] = await Promise.all([
        getData(`/api/submissions/${submissionId}`),
        getData(`/api/rubrics/${rubricId}`),
      ]);
      setSubmissionLink(submission.s3Link);
      setRubric(rubric.rubric);
    })();
  }, []);

  return (
    <div className="Content">
      <Container name="Grade User 1's Submission">
        <Submission sublink={submissionLink} rubric={rubric} />
      </Container>
    </div>
  );
};

export default PeerReview;
