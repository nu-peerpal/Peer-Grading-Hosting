import React, { useState, useEffect } from "react";
import Container from "../../../components/container";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from "@material-ui/core/Button";
import styles from './reviewreportlist.module.scss';
// import subData from "../../../sample_data/submissionReports";
// import revData from "../../../sample_data/reviewReports";
import { submissionReports, reviewReports } from "../../api/AlgCalls.js";
import { useUserData } from "../../../components/storeAPI";
import { useRouter } from 'next/router'
const ReactMarkdown = require('react-markdown');
const gfm = require('remark-gfm')
const axios = require("axios");


const ReviewReports = () => {
  const router = useRouter()
  const { userId, courseId, courseName, assignment, key, setKey } = useUserData();
  const [needsLoading, setNeedsLoading] = useState(true);
  const [subData, setSubData] = useState({});
  const [revData, setRevData] = useState({});
  const [subReports, setSubReports] = useState([]);
  const [uploadSubReports, setUploadSubReports] = useState();
  const [revReports, setRevReports] = useState([]);
  const [uploadRevReports, setUploadRevReports] = useState();
  const [users, setUsers] = useState([]);
  const [peerMatchings, setPeerMatchings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState();
  let { assignmentId, assignmentName, rubricId } = router.query;
  if (!rubricId) rubricId = 1;

  async function handleSubmit() {
    console.log({uploadRevReports})
    console.log({uploadSubReports})
  }

  async function generateReports() {
    Promise.all([submissionReports(subData.graders,subData.reviews,subData.rubric),reviewReports(revData.graders,revData.reviews,revData.rubric),axios.get(`/api/canvas/submissions?courseId=${courseId}&assignmentId=${assignmentId}`)])
    .then(reports => {
      console.log('reports',reports);
      setUploadSubReports(reports[0]);
      setUploadRevReports(reports[1]);
      let submissions = reports[2].data.data;
      // Change Submissions to Names for Submission Reports
      // organize submissions by group
      let subGroups = {};
      submissions.forEach(submission => { // sort submissions by {groupId: [...userIds]}
        if (subGroups[submission.groupId]) {
          subGroups[submission.groupId].push(submission.submitterId);
          subGroups[submission.groupId].sort(function(a, b){return a-b})
        } else {
          subGroups[submission.groupId] = [submission.submitterId];
        }
      });
      let tempGroup, tempSub, tempAid;
      for (let sub in submissions) { // grab group, find lowest group member, get aid
        tempGroup = submissions[sub]["groupId"];
        tempSub = submissions.filter(sub => sub.submitterId == subGroups[tempGroup][0]);
        tempAid = tempSub[0].canvasId;
        submissions[sub]["canvasId"] = tempAid;
      }
      let subStudents = {};
      for (let sub in submissions) {
        let student = users.filter(user => user.canvasId == submissions[sub]["submitterId"])
        student = student[0]["firstName"] + " " + student[0]["lastName"];
        if (subStudents[submissions[sub]["canvasId"]]) {
          subStudents[submissions[sub]["canvasId"]].push(student);
        } else {
          subStudents[submissions[sub]["canvasId"]] = [student];
        }
      }
      for (let subRep in reports[0][1]) { // get users per submission
        let subId = reports[0][1][subRep][0];
        reports[0][1][subRep][0] = String(subStudents[subId]);
      }
      setSubReports(reports[0][1]);
      // Change User ID to User Name for Review Reports
      for (let revRep in reports[1][1]) {
        let i = users.findIndex(x => x.canvasId == reports[1][1][revRep][0])
        reports[1][1][revRep][0] = users[i]["firstName"] + " "+ users[i]["lastName"];
        reports[1][1][revRep][1] = String(subStudents[reports[1][1][revRep][1]]);
      }
      setRevReports(reports[1][1]);
      setNeedsLoading(false);

    }).catch(err => {
      console.log(err);
    });
  }
  useEffect(() => {
    Promise.all([axios.get(`/api/peerReviews?assignmentId=${assignmentId}`),axios.get(`/api/canvas/users?courseId=${courseId}`),axios.get(`/api/rubrics/${rubricId}`)]).then(dbData => {
      let peerReviews = dbData[0].data.data;
      setPeerMatchings(peerReviews);
      let users = dbData[1].data.data;
      let rubric = dbData[2].data.data.rubric;
      rubric = rubric.map(section => {
        return [section.points, section.title];
      })
      // console.log({peerReviews})
      let TAs = users.filter(user => user.enrollment == "TaEnrollment");
      let subReportData, revReportData;
      let graders = [];
      let reviews = [];
      let revReviews = [];
      console.log({TAs})
      console.log({peerReviews})
      console.log({rubric})
      peerReviews.forEach(pr => {
        let adjustedReview;
        let score;
        let scores = [];
        let comments = [];
        let assessments =[];
        let grade;
        let grader = false;
        
        for (let ta in TAs) {
          // console.log('ta id',TAs[ta].canvasId)
          if (TAs[ta].canvasId == pr.userId) {
            grader = true;
            if (pr.reviewReview) { // only add if this grader actually graded
              if (!graders.includes(pr.userId)) graders.push(pr.userId);
              adjustedReview = pr.reviewReview.instructorGrades.map(row => {
                return [Math.round((row.points/row.maxPoints)*100)/100, row.comment];
              });
              console.log({pr})
              reviews.push([pr.userId, pr.submissionId, {scores: adjustedReview, comments: []}]); // for submission reports
              // now, review reports
              pr.reviewReview.instructorGrades.forEach(row => { // grade for actual submission
                score = Math.round((row.points/row.maxPoints)*100)/100;
                scores.push([score, row.comment]);
                // comments.push()
              })
              // console.log({adjustedRevScores})
              let sumGrade = 0;
              let totalGrade = 0;
              pr.reviewReview.reviewBody.forEach(row => { // grade for peer review
                score = Math.round((row.points/row.maxPoints)*100)/100;
                sumGrade += row.points;
                totalGrade += row.maxPoints;
                assessments.push([score, row.comment]);
              });
              grade = Math.round((sumGrade/totalGrade)*100)/100
              // console.log({adjustedRevReview})
              let reviewReview = {
                scores: scores,
                // comments: comments,
                assessments: assessments,
                grade: grade
              }
              // console.log({reviewReview})
              revReviews.push([pr.userId, pr.submissionId, reviewReview])
            }
            break;
          }
        }
        if (!grader) {
          if (pr.review) { // only if the user submitted a review
            adjustedReview = pr.review.reviewBody.scores.map((row,i) => {
              return [Math.round((row[0]/rubric[i][0])*100)/100,row[1]]
            })
            reviews.push([pr.userId, pr.submissionId, {scores: adjustedReview, comments: []}]);
          }
          if (pr.reviewReview) {
            pr.reviewReview.instructorGrades.forEach(row => { // grade for actual submission
              score = Math.round((row.points/row.maxPoints)*100)/100;
              scores.push([score, row.comment]);
              // comments.push()
            })
            // console.log({adjustedRevScores})
            let sumGrade = 0;
            let totalGrade = 0;
            pr.reviewReview.reviewBody.forEach(row => { // grade for peer review
              score = Math.round((row.points/row.maxPoints)*100)/100;
              sumGrade += row.points;
              totalGrade += row.maxPoints;
              assessments.push([score, row.comment]);
            });
            grade = Math.round((sumGrade/totalGrade)*100)/100
            // console.log({adjustedRevReview})
            let reviewReview = {
              scores: scores,
              // comments: comments,
              assessments: assessments,
              grade: grade
            }
            // console.log({reviewReview})
            revReviews.push([pr.userId, pr.submissionId, reviewReview])
          }
        }
      });
      subReportData = {
        graders: graders,
        reviews: reviews,
        rubric: rubric
      }
      revReportData = {
        graders: graders,
        reviews: revReviews,
        rubric: rubric
      }
      console.log({subReportData})
      console.log({revReportData})
      setSubData(subReportData);
      setRevData(revReportData);
      setUsers(users);
      setIsLoading(false);
    })
    // console.log(reports);
    // submissionReports(subData.graders,subData.reviews,subData.rubric)
  },[])

  return (
    <div className="Content"> 
      {needsLoading ? 
        <Container name={"Generate Reports"}>
          <Button disabled={isLoading} onClick={() => generateReports()}>Generate Reports</Button>
        </Container>
      :
        <div>
        <Container name={"Submission Reports for " + assignmentName} >
          {
            subReports.map(sub =>
              <Accordion key={sub[0]}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                <Typography >Submission from: {sub[0]}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className={styles.details}>
                      <ReactMarkdown plugins={[gfm]} children={sub[1]} />
                    </div>
                </AccordionDetails>
              </Accordion>
            )
          }
        </Container>
        <Container name={"Review Reports for " + assignmentName}>
        {
            revReports.map(rev =>
              <Accordion key={rev[0]+rev[1]}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                <Typography >{rev[0]}: submission from {rev[1]}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className={styles.details}>
                      <ReactMarkdown plugins={[gfm]} children={rev[2]} />
                    </div>
                </AccordionDetails>
              </Accordion>
            )
          }
        </Container>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }} >
            <Button onClick={handleSubmit}>
              Confirm Reports
            </Button>
            {errors}
          </div>
        </div>
      }
    </div>
  );
};

export default ReviewReports;
