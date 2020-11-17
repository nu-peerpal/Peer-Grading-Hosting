import React, { useState, useEffect } from "react";
import styles from "./styles/grades.module.css";
import ListContainer from "../components/listcontainer";

const fetcher = url => fetch(url, { method: "GET" }).then(r => r.json());

function Grades() {
  const [submissionGrades, setSubmissionGrades] = useState([]);
  const [reviewGrades, setReviewGrades] = useState([]);
  const userId = 1;

  useEffect(() => {
    (async () => {
      let resData = await fetcher("/api/assignments?graded=true&courseId=1");
      let assignments = resData.data;

      let submissions = [];
      let reviewGrades = [];

      const submissionReviewGrades = await Promise.all(
        assignments.map(async ({ id }) => {
          const getSubmissions = async () => {
            let resData = await fetcher(
              `/api/groups?assignmentId=${id}&userId=${userId}`,
            );
            const groupId = resData.data[0].id; // user should only have one group for the assignment

            resData = await fetcher(
              `/api/submissions?assignmentId=${id}&groupId=${groupId}`,
            );
            return resData.data; // should only be 0 or 1 submission grade per assignment
          };

          const getReviewGrades = async () => {
            let resData = await fetcher(
              `/api/reviewGradesReports?assignmentId=${id}&userId=${userId}`,
            );
            return resData.data; // should only be 0 or 1 review grade per assignment
          };

          return Promise.all([getSubmissions(), getReviewGrades()]);
        }),
      );

      for (const [submission, reviewGrade] in submissionReviewGrades) {
        if (submission) {
          // if submission grade exists
          submissions = [...submissions, ...submission];
        }
        if (reviewGrade) {
          // if review grade exists
          reviewGrades = [...reviewGrades, ...reviewGrade];
        }
      }

      submissions = submissions.map((submission, i) => ({
        name: assignments[i].name,
        info: submission.grade,
        data: submission,
      }));

      reviewGrades = submissions.map((reviewGrade, i) => ({
        name: assignments[i].name,
        info: reviewGrade.grade,
        data: reviewGrade,
      }));

      setSubmissionGrades(submissions);
      setReviewGrades(reviewGrades);
    })();
  }, []);

  return (
    <div class="Content">
      <ListContainer
        name="Graded Peer Reviews"
        data={reviewGrades}
        link="/grades/viewprgrade"
      />
      <ListContainer
        name="Graded Assignments"
        data={submissionGrades}
        link="/grades/viewassignmentgrade"
      />
    </div>
  );
}

export default Grades;
