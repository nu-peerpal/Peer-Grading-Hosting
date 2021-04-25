import React, { useState, useEffect } from "react";
import Container from "../../components/container";
import StudentViewOutline from '../../components/studentViewOutline';

const fetcher = url => fetch(url, { method: "GET" }).then(r => r.json());

function ViewAssignmentGrade(props) {
  const assignmentId = 1;
  const [assignment, setAssignment] = useState({});
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    (async () => {
      const [assignmentRes, submissionsRes] = await Promise.all([
        fetcher(`/api/assignments/${assignmentId}`),
        fetcher(`/api/submissions?assignmentId=${assignmentId}`),
      ]);
      setAssignment(assignmentRes.data);
      setSubmissions(submissionsRes.data);
    })();
  }, []);

  // Needs work: minor improvements to V0
  return (
    <div className="Content">
      <Container name={`Grade for Assignment ${assignmentId}`}>
        <div>Assignment: {assignment.name}</div>
        <br />
        {submissions.map(submission => (
          <>
            <div>Grade: {submission.grade}</div>
            <div>Report: {JSON.stringify(submission.report)}</div>
            <br />
          </>
        ))}
      </Container>
      <StudentViewOutline SetIsStudent={props.SetIsStudent}/>
    </div>
  );
}

export default ViewAssignmentGrade;
