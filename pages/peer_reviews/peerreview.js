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
      {
        id: '12441_483',
        description: 'Poem is long enough. Deduct one point for each line missing below 10.',
        long_description: 'Poem is long enough. Deduct one point for each line missing below 10.Poem is long enough. Deduct one point for each line missing below 10.',
        points: 10,
        mastery_points: null,
        ignore_for_scoring: null,
        learning_outcome_migration_id: null,
        title: 'Poem is long enough. Deduct one point for each line missing below 10.',
        ratings: [ [Object], [Object], [Object] ]
      },
      {
        id: '12441_6812',
        description: 'Poem contains at least one Greek character.',
        long_description: 'Poem is long enough. Deduct one point for each line missing below 10.Poem is long enough. Deduct one point for each line missing below 10.',
        points: 5,
        mastery_points: null,
        ignore_for_scoring: null,
        learning_outcome_migration_id: null,
        title: 'Poem contains at least one Greek character.',
        ratings: [ [Object], [Object] ]
      },
      {
        id: '12441_7888',
        description: 'Poem contains a mathematical symbol.',
        long_description: 'Poem is long enough. Deduct one point for each line missing below 10.Poem is long enough. Deduct one point for each line missing below 10.',
        points: 5,
        mastery_points: null,
        ignore_for_scoring: null,
        learning_outcome_migration_id: null,
        title: 'Poem contains a mathematical symbol.',
        ratings: [ [Object], [Object] ]
      }
    ]
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
