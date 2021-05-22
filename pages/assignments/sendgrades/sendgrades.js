import React, { useState, useEffect } from "react";
import Container from "../../../components/container";
import styles from "./sendgrades.module.scss";
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useRouter } from 'next/router';
import { useUserData } from "../../../components/storeAPI";
import StudentViewOutline from '../../../components/studentViewOutline';
const axios = require("axios");

function SendGrades(props) {
  const { userId, courseId, courseName, assignment } = useUserData();
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [uploadReady, setUploadReady] = useState(false);
  const [canvasUploaded, setCanvasUploaded] = useState("");
  const { assignmentId, assignmentName, rubricId } = router.query;

  async function handleUpload() {
      axios.get(`/api/assignments/${assignmentId}`).then(async assignmentData => {
          let dbAssignment = assignmentData.data.data;
          //// compile grades to push
          let submissionGrades = [];
          let reviewGrades = [];
          students.forEach(student => {
              if (student.grade == "not submitted") { // if no submission, grade is 0
                  submissionGrades.push([parseInt(student.canvasId), 0]);
              } else {
                submissionGrades.push([parseInt(student.canvasId), parseInt(student.grade)]);
              }
              if (student.reviewGrade == "reviews not submitted") {
                reviewGrades.push([parseInt(student.canvasId), 0]);
              } else {
                reviewGrades.push([parseInt(student.canvasId), student.reviewGrade]);
              }
          });
          console.log({submissionGrades})
          console.log({reviewGrades})
          // post submission grades
          let postSubmissionGrades = {
              courseId: courseId,
              assignmentId: assignmentId,
              grades: submissionGrades
          }
          let subRes = await axios.post(`/api/canvas/grades`, postSubmissionGrades).catch(err => console.log({err}));
          // post review grades
          let postReviewGrades = {
              courseId: courseId,
              assignmentId: dbAssignment.reviewCanvasId,
              grades: reviewGrades
          }
          let revRes = await axios.post(`/api/canvas/grades`, postReviewGrades).catch(err2 => console.log({err2}));
          
          axios.patch(`/api/assignments/${assignmentId}`, {reviewStatus: 9}).then(res => {
            setCanvasUploaded("Submitted to Canvas.")
          })
      });
  }

  useEffect(() => {
    Promise.all([axios.get(`/api/users?courseId=${courseId}&enrollment=StudentEnrollment`),axios.get(`/api/submissions?assignmentId=${assignmentId}`),axios.get(`/api/reviewGradesReports?assignmentId=${assignmentId}`),axios.get(`/api/canvas/submissions?courseId=${courseId}&assignmentId=${assignmentId}`),axios.get(`/api/peerReviews?assignmentId=${assignmentId}&matchingType=appeal`)]).then(responseData => {
        let userData = responseData[0].data.data;
        let submissionsData = responseData[1].data.data;
        let reviewGradesData = responseData[2].data.data;
        let canvasSubmissionsData = responseData[3].data.data;
        let appealData = responseData[4].data.data;
        setStudents(userData);
        console.log({userData})
        console.log({submissionsData})
        console.log({reviewGradesData})
        console.log({canvasSubmissionsData})
        console.log({appealData})
        // match users to submissions
        userData.forEach(student => {
            let userSubmissions = canvasSubmissionsData.filter(sub => sub.submitterId == student.canvasId);
            if (userSubmissions.length > 0 && userSubmissions[0].submission) {
                let subGroupId = userSubmissions[0].groupId;
                if (!subGroupId) { 
                    subGroupId = userSubmissions[0].submitterId;
                }
                let submission = submissionsData.filter(sub => sub.groupId == subGroupId);
                console.log({submission})
                if (submission.length == 0) { // empty assignment, didn't turn it in
                    student.grade = 'not submitted';
                } else {
                    student.grade = submission[0].grade;
                }
            } else { // user did not submit assignment
                student.grade = 'not submitted';
            }
            // get review grades
            let userReviews = reviewGradesData.filter(review => review.userId == student.canvasId);
            console.log({userReviews})
            if (userReviews.length > 0) {
                let revGrade;
                let index = 0;
                userReviews.forEach((review, i) => {
                    if (!review.report.includes("(Ungraded)")) {
                        index = i;
                    }
                });
                console.log({userReviews})
                if (userReviews[index].report.includes("(Ungraded)")) {
                    revGrade = ["Ungraded"];
                } else {
                    revGrade = userReviews[index].report.match(/\d+\.\d+|\d+\b|\d+(?=\w)/g).map(function (v) {return +v;});
                    // console.log({revGrade})
                }
                student.reviewGrade = revGrade[0];
            } else {
                student.reviewGrade = "reviews not submitted"
            }
        });
        setUploadReady(true);
    })
  }, []);


  return (
    <div className="Content">
      <Container name={"Send grades for: " + assignmentName}>
        {
            students.map((user,i) =>
                <Accordion key={user.id}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography style={{textAlign: "left"}}>{user.firstName + " " + user.lastName} Grade: {user.grade}, Review Grade: {user.reviewGrade}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className={styles.details}>
                        details forthcoming
                    </div>
                </AccordionDetails>
                </Accordion>
            )
        }
      </Container>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }} >
        <Button disabled={!uploadReady} onClick={handleUpload}>
            Submit to Canvas
        </Button>
        {canvasUploaded}
      </div>
      <StudentViewOutline isStudent={props.ISstudent} SetIsStudent={props.SetIsStudent} />
    </div>
  );

}

export default SendGrades;
