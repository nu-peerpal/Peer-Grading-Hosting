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
  const router = useRouter()
  let { submissionId } = router.query;

  // const submissionId = 1;
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

  useEffect(() => {
    (async () => {
      const [submission, assignmentData] = await Promise.all([
        getData(`/api/submissions?type=peerreview&submissionId=${submissionId}`),
        getData(`/api/assignments/${assignment}`),
      ]);
      console.log({assignmentData})
      setSubmission(submission);
      setRubric(rubricOne.rubric);
      // setSubmissionLink(pdfUrl);
    })();
  }, []);

  return (
    <div className="Content">
      <Container name={"Grade Submission " + submissionId}>
        <Submission sublink={submission.s3Link} submission={submission} rubric={rubric} />
      </Container>
      <StudentViewOutline SetIsStudent={props.SetIsStudent} />
    </div>
  );
};

export default PeerReview;
