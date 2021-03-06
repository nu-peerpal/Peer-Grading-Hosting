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
  const { userId, courseId, courseName } = useUserData();
  const [needsLoading, setNeedsLoading] = useState(true);
  const [subData, setSubData] = useState({});
  const [revData, setRevData] = useState({});
  const [submissionMap, setSubmissionMap] = useState();
  const [canvasUploaded, setCanvasUploaded] = useState();
  const [subReports, setSubReports] = useState([]);
  const [uploadSubReports, setUploadSubReports] = useState();
  const [revReports, setRevReports] = useState([]);
  const [uploadRevReports, setUploadRevReports] = useState();
  const [dbSubmissions, setDbSubmissions] = useState([])
  const [users, setUsers] = useState([]);
  const [peerMatchings, setPeerMatchings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState();
  const [subReportsLog, setSubReportsLog] = useState("");
  const [revReportsLog, setRevReportsLog] = useState("");
  const [loadSRSubmission, setLoadSRSubmission] = useState();
  const [loadRRSubmission, setLoadRRSubmission] = useState();
  let { assignmentId, assignmentName, rubricId } = router.query;
  if (!rubricId) rubricId = 1;

  async function handleUpload() {
    let subGrades = uploadSubReports[0]; // [subId, grade]
    let revGrades = uploadRevReports[0] // [userId, grade]
    // step 1 post submission data
    let userSubGrades = [];
    subGrades.forEach(subGrade => {
      submissionMap[subGrade[0]].forEach(studentId => {
        userSubGrades.push([parseInt(studentId), subGrade[1]])
      })
    });
    console.log({userSubGrades})
    let subGradePost = {
      courseId: courseId,
      assignmentId: assignmentId,
      grades: userSubGrades
    }
    let res1 = await axios.post(`/api/canvas/grades`,subGradePost).catch(err => console.log({err}))
    
    let assignmentData = await axios.get(`/api/assignments/${assignmentId}`);
    let assignment = assignmentData.data.data;
    let revGradePost = {
      courseId: courseId,
      assignmentId: assignment.reviewCanvasId,
      grades: revGrades
    }
    let res2 = await axios.post(`/api/canvas/grades`,revGradePost).catch(err => console.log({err}))
    // console.log({revGradePost})
    // console.log({uploadSubReports})
    // console.log({uploadRevReports});
    setCanvasUploaded('Submitted to Canvas.');
  }
  async function handleSubmit() {
    // axios.get(`/api/submissions?assignmentId=${assignmentId}`).then(async subData => {
      console.log({dbSubmissions})
      console.log({uploadSubReports})
      let assignment_submissions = dbSubmissions.map(submission => {
        let v = uploadSubReports[0].findIndex(x => x[0] == submission.canvasId);
        let w = uploadSubReports[1].findIndex(x => x[0] == submission.canvasId);
        let grade = uploadSubReports[0][v][1];
        let report = uploadSubReports[1][w][1]
        return {
          id: submission.id,
          assignmentId: submission.assignmentId,
          canvasId: submission.canvasId,
          submissionType: submission.submissionType,
          grade: grade,
          report: report,
          s3Link: submission.s3Link,
          groupId: submission.groupId,
        }
      });
      let errs = [];
      console.log('uploading submission grades to db:',assignment_submissions);
      await axios.patch(`/api/submissions?type=multiple`, assignment_submissions).then(res => {
        console.log({res})
      }).catch(err => {
        errs.push(err);
        console.log({err})});

      // check for review_reports
      let dbRevReports = await axios.get(`/api/reviewGradesReports?assignmentId=${assignmentId}`);
      dbRevReports = dbRevReports.data.data;
      let review_grades_reports;
      if (dbRevReports.length > 0) {
        review_grades_reports = uploadRevReports[1].map(report => {
          console.log('finding report data:', report[0],report[1])
          let dbReport = dbRevReports.filter(r => (r.userId == report[0] && r.assignmentId == assignmentId && r.grade == report[1]));
          if (dbReport.length > 1) console.log('too many matches')
          return {
            id: dbReport[0].id,
            grade: report[1],
            report: report[2],
            assignmentId: parseInt(assignmentId),
            userId: report[0]
          }
        });
        console.log('updating review reports:', review_grades_reports);
        await axios.patch(`/api/reviewGradesReports?type=multiple`, review_grades_reports).then(res => {
          console.log({res})
        }).catch(err => {
          errs.push(err);
          console.log({err})});
      } else {
        review_grades_reports = uploadRevReports[1].map(report => {
          return {
            grade: report[1],
            report: report[2],
            assignmentId: parseInt(assignmentId),
            userId: report[0]
          }
        })
        console.log('uploading review reports:', review_grades_reports);
        await axios.post(`/api/reviewGradesReports?type=multiple`, review_grades_reports).then(res => {
          console.log({res})
        }).catch(err => {
          errs.push(err);
          console.log({err})});
      }

      console.log('updating assignment to graded');
      await axios.patch(`/api/assignments/${assignmentId}`, {graded: true}).then(res => {
        console.log({res})
      }).catch(err => {
        errs.push(err);
        console.log({err})});

        if (errs.length == 0) {
          setErrors("Submitted Successfully.")
          axios.patch(`/api/assignments/${assignmentId}`, {reviewStatus: 7});
        } else {
          setErrors(errs);
        }
    // });

    // console.log({uploadRevReports})
    // console.log({uploadSubReports})
  }

  async function generateReports() {
    Promise.all([submissionReports(subData.graders,subData.reviews,subData.rubric),reviewReports(revData.graders,revData.reviews,revData.rubric, revData.reviewRubric),axios.get(`/api/canvas/submissions?courseId=${courseId}&assignmentId=${assignmentId}`),axios.get(`/api/submissions?assignmentId=${assignmentId}`)])
    .then(reports => {
      console.log('reports',reports);
      setUploadSubReports(reports[0]);
      setUploadRevReports(reports[1]);
      setRevReportsLog(reports[1][3]);
      setSubReportsLog(reports[0][2])
      let dbSubs = reports[3].data.data;
      setDbSubmissions(dbSubs);
      let submissions = reports[2].data.data;
      // Change Submissions to Names for Submission Reports
      // organize submissions by group
      let subGroups = {};
      let bucket;
      submissions.forEach(submission => { // sort submissions by {groupId: [...userIds]}
        if (!submission.groupId) {
          bucket = submission.submitterId;
        } else {
          bucket = submission.groupId;
        }
        if (subGroups[bucket]) {
          subGroups[bucket].push(submission.submitterId);
          subGroups[bucket].sort(function(a, b){return a-b})
        } else {
          subGroups[bucket] = [submission.submitterId];
        }
      });
      let tempGroup, tempSub, tempAid;
      for (let sub in submissions) { // grab group, find lowest group member, get aid
        if (!submissions[sub]["groupId"]) { // if null group, change to userId
          tempGroup = submissions[sub].submitterId;
        } else {
          tempGroup = submissions[sub]["groupId"];
        }
        // tempGroup = submissions[sub]["groupId"];
        tempSub = submissions.filter(sub => sub.submitterId == subGroups[tempGroup][0]);
        tempAid = tempSub[0].canvasId;
        submissions[sub]["canvasId"] = tempAid;
      }
      let subStudents = {};
      let submissionMap = {};
      for (let sub in submissions) { // map submissionId: ...userIds
        let student = users.filter(user => user.canvasId == submissions[sub]["submitterId"])
        let studentId = student[0].canvasId;
        student = student[0]["firstName"] + " " + student[0]["lastName"];
        bucket = submissions[sub]["canvasId"];
        // if (submissions[sub]["groupId"]) {
        //   bucket = submissions[sub]["canvasId"];
        // } else {
        //   bucket = submissions[sub]["submitterId"]; // if null group, subId = userId in database
        // }
        if (subStudents[bucket]) {
          subStudents[bucket].push(student);
          submissionMap[bucket].push(studentId);
        } else {
          subStudents[bucket] = [student];
          submissionMap[bucket] = [studentId];
        }
      }
      console.log({subStudents})
      console.log({submissionMap})
      setSubmissionMap(submissionMap);
      let newSubReport = [];
      for (let subRep in reports[0][1]) { // get users per submission
        let subId = reports[0][1][subRep][0];
        let j = dbSubs.findIndex(x => x.canvasId == subId);
        let subGrade;
        if (reports[0][1][subRep][1].includes("(Ungraded)")) {
          subGrade = ["Ungraded"];
        } else {
          subGrade = reports[0][1][subRep][1].match(/\d+\.\d+|\d+\b|\d+(?=\w)/g).map(function (v) {return +v;}); // grab every float from string
        }// console.log('grade:',subGrade[0])
        newSubReport[subRep] = [String(subStudents[subId])];
        newSubReport[subRep].push(reports[0][1][subRep][1]);
        newSubReport[subRep].push(dbSubs[j].s3Link);
        newSubReport[subRep].push(subGrade[0]);
      }
      console.log({newSubReport})
      setSubReports(newSubReport);
      // Change User ID to User Name for Review Reports
      let newReviewReport = [];
      for (let revRep in reports[1][1]) {
        let i = users.findIndex(x => x.canvasId == reports[1][1][revRep][0]);
        let j = dbSubs.findIndex(x => x.canvasId == reports[1][1][revRep][1]);
        let revGrade;
        if (reports[1][1][revRep][2].includes("(Ungraded)")) {
          revGrade = ["Ungraded"];
        } else {
          revGrade = reports[1][1][revRep][2].match(/\d+\.\d+|\d+\b|\d+(?=\w)/g).map(function (v) {return +v;});
        }
        newReviewReport[revRep] = [users[i]["firstName"] + " "+ users[i]["lastName"]];
        newReviewReport[revRep].push(String(subStudents[reports[1][1][revRep][1]]));
        newReviewReport[revRep].push(reports[1][1][revRep][2]);
        newReviewReport[revRep].push(dbSubs[j].s3Link);
        newReviewReport[revRep].push(revGrade[0]);
      }
      console.log({newReviewReport})
      setRevReports(newReviewReport);
      setNeedsLoading(false);

    }).catch(err => {
      console.log(err);
    });
  }
  useEffect(() => {
    Promise.all([axios.get(`/api/peerReviews?assignmentId=${assignmentId}`),axios.get(`/api/canvas/users?courseId=${courseId}`),axios.get(`/api/rubrics/${rubricId}`), axios.get(`/api/users`)]).then(dbData => {
      let peerReviews = dbData[0].data.data;
      setPeerMatchings(peerReviews);
      let users = dbData[1].data.data;
      let rubric = dbData[2].data.data.rubric;
      let dbUsers = dbData[3].data.data;
      rubric = rubric.map(section => {
        return [section.points, section.title];
      });
      let reviewRubric = [];
      // console.log({peerReviews})
      let TAs = users.filter(user => user.enrollment == "TaEnrollment");
      let subReportData, revReportData;
      let graders = [];
      let reviews = [];
      let revReviews = [];
      console.log({TAs})
      console.log({peerReviews})
      // console.log({rubric})
      peerReviews.forEach(pr => { // identify TA for reviewreview
        for (let ta in TAs) {
          // console.log('ta id',TAs[ta].canvasId)
          if (TAs[ta].canvasId == pr.userId) {
            // grader = true;
            if (!graders.includes(pr.userId)) graders.push(pr.userId); 
          }
        }
      })
      peerReviews.forEach(pr => {
        let adjustedReview, reviewScores;
        let score;
        let scores = [];
        // let comments = [];
        let assessment =[];
        let grade;

        if (pr.review) { // ignore blank reviews
          reviewScores = pr.review.reviewBody.scores.map((row,i) => {
            return [Math.round((row[0]/rubric[i][0])*100)/100,row[1]] // convert scores to {0 - 1} scale
          });
          if (pr.reviewReview) { 
            if (reviewRubric.length === 0) { // construct reviewRubric for alg
              reviewRubric = pr.reviewReview.reviewBody.map(row => [row.maxPoints, row.element])
              // console.log({reviewRubric})
            }
            pr.reviewReview.instructorGrades.forEach(row => { // grade for actual submission
              score = Math.round((row.points/row.maxPoints)*100)/100;
              scores.push([score, row.comment]);
            })
            let sumGrade = 0;
            let totalGrade = 0;
            pr.reviewReview.reviewBody.forEach(row => { // grade for peer review
              score = Math.round((row.points/row.maxPoints)*100)/100;
              sumGrade += row.points;
              totalGrade += row.maxPoints;
              assessment.push([score, row.comment]);
            });
            grade = sumGrade;
            // console.log({adjustedRevReview})
            adjustedReview = {
              scores: reviewScores,
              comments: [],
              assessment: assessment,
              grade: grade
            }
            let graderReview = {
              scores: scores,
              comments: []
            }
            reviews.push([pr.userId, pr.submissionId, adjustedReview]) // push review + reviewreview
            revReviews.push([pr.userId, pr.submissionId, adjustedReview])
            // check to see if we already pushed the grader's manual review
            let foundReview = false;
            for (let rev in reviews) {
              if (reviews[rev][1] == pr.submissionId && reviews[rev][0] == graders[0]) foundReview = true;
            }
            if (!foundReview) { // if grader review of this submission doesn't exist yet, push it
              reviews.push([graders[0], pr.submissionId, graderReview]) // grader review
              revReviews.push([graders[0], pr.submissionId, graderReview])
            }
          } else {
            adjustedReview = {
              scores: reviewScores,
              comments: []
            }
            reviews.push([pr.userId, pr.submissionId, adjustedReview])
            revReviews.push([pr.userId, pr.submissionId, adjustedReview])
          }
        }});

      subReportData = {
        graders: graders,
        reviews: reviews,
        rubric: rubric
      }
      revReportData = {
        graders: graders,
        reviews: revReviews,
        rubric: rubric,
        reviewRubric: reviewRubric
      }
      console.log({subReportData})
      console.log({revReportData})
      setSubData(subReportData);
      setRevData(revReportData);
      setUsers(dbUsers);
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
        {subReportsLog && <div className={styles.logs}>Algorithm log: {subReportsLog}</div>}
          {
            subReports.map((sub,i) =>
              <Accordion key={sub[0]+i}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography style={{textAlign: "left"}}>Submission: {sub[0]}. Grade: {sub[3]}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className={styles.details}>
                      {i === loadSRSubmission ? 
                      <SubmissionView s3Link={sub[2]}/>
                      :
                        <Button onClick={() => setLoadSRSubmission(i)}>Load Submission</Button>
                      }
                      <ReactMarkdown plugins={[gfm]} children={sub[1]} />
                    </div>
                </AccordionDetails>
              </Accordion>
            )
          }
        </Container>
        <Container name={"Review Reports for " + assignmentName}>
          {revReportsLog && <div className={styles.logs}>Algorithm log: {revReportsLog}</div>}
        {
            revReports.map((rev,i) =>
              <Accordion key={rev[0]+rev[1]+i}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                <Typography >Reviewer: {rev[0]}. Submission: {rev[1]}. Grade: {rev[4]}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className={styles.details}>
                    {i === loadRRSubmission ? 
                      <SubmissionView s3Link={rev[3]}/>
                      :
                        <Button onClick={() => setLoadRRSubmission(i)}>Load Submission</Button>
                      }
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
          {/* <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }} >
            <Button disabled={true} onClick={handleUpload}>
              Submit to Canvas
            </Button>
            {canvasUploaded}
          </div> */}
        </div>
      }
    </div>
  );
};

function SubmissionView(props) {
  if (props.s3Link.includes('http')) {
    return <iframe style={{ width:"100%",height:"100%",minHeight:"80vh"}} src={props.s3Link}></iframe>
  } else {
    return <div>{props.s3Link}</div>
  }
}
export default ReviewReports;
