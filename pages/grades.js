import React, { useState, useEffect } from "react";
import ListContainer from "../components/listcontainer";
import StudentViewOutline from '../components/studentViewOutline';
import { useUserData } from "../components/storeAPI";
const axios = require("axios");

function Grades(props) {
  const { userId, courseId, courseName, assignment } = useUserData();
  const [submissionGrades, setSubmissionGrades] = useState([]);
  const [gradedAssignments, setGradedAssignments] = useState([])
  const [reviewGrades, setReviewGrades] = useState([]);

  useEffect(() => {
    axios.get(`/api/assignments?graded=true&courseId=${courseId}`).then(assignmentData => {
      setGradedAssignments(assignmentData.data.data);

    })
  }, [])
  // useEffect(() => {
  //   (async () => {
  //     let resData = await axios.get(`/api/assignments?graded=true&courseId=${courseId}`);
  //     let assignments = resData.data.data;

  //     let submissions = [];
  //     let reviewGrades = [];

  //     const submissionReviewGrades = await Promise.all(
  //       assignments.map(async ({ id }) => {
  //         const getSubmissions = async () => {
  //           resData = await axios.get(`/api/submissions?assignmentId=${id}`);
  //           return resData.data.data; // should only be 0 or 1 submission grade per assignment
  //         };

  //         const getReviewGrades = async () => {
  //           console.log(id, userId)
  //           let resData = await axios.get(`/api/reviewGradesReports?assignmentId=${id}&userId=${userId}`);
  //           return resData.data.data; // should only be 0 or 1 review grade per assignment
  //         };

  //         return Promise.all([getSubmissions(), getReviewGrades()]);
  //       }),
  //     );
  //     // console.log({submissionReviewGrades})

  //     for (const index in submissionReviewGrades) {
  //       let submission = submissionReviewGrades[index][0];
  //       let reviewGrade = submissionReviewGrades[index][1];
  //       // console.log({submission})
  //       // console.log({reviewGrade})
  //       if (submission) {
  //         // if submission grade exists
  //         submissions = [...submissions, ...submission];
  //       }
  //       if (reviewGrade) {
  //         // if review grade exists
  //         reviewGrades = [...reviewGrades, ...reviewGrade];
  //       }
  //     }
  //     console.log({submissions})
  //     console.log({reviewGrades})
  //     submissions = submissions.map((submission, i) => ({
  //       name: assignments[i].name,
  //       info: submission.grade,
  //       data: submission,
  //     }));

  //     reviewGrades = reviewGrades.map((reviewGrade, i) => ({
  //       name: assignments[i].name,
  //       info: reviewGrade.grade,
  //       data: reviewGrade,
  //     }));
  //     // console.log({submissions})
  //     // console.log({reviewGrades})
  //     setSubmissionGrades(submissions);
  //     setReviewGrades(reviewGrades);
  //   })();
  // }, []);

  return (
    <div className="Content">
      {/* <ListContainer
        name="Graded Peer Reviews"
        data={reviewGrades}
        link="/grades/viewprgrade"
      /> */}
      <ListContainer
        name="Graded Assignments"
        data={gradedAssignments}
        link="/grades/viewgrades"
      />
      <StudentViewOutline SetIsStudent={props.SetIsStudent}/>
    </div>
  );
}

export default Grades;
