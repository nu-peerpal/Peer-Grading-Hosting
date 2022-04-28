import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/submissionview.module.scss";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Field, Formik, Form } from "formik";
import TextField from "@material-ui/core/TextField";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Typography from '@material-ui/core/Typography';
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Tooltip from '@material-ui/core/Tooltip';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import BarChart from "./BarChart";
import SubmissionComments from "./SubmissionComments";
import { palette } from '@material-ui/system';
const axios = require("axios");
import _ from "lodash";

/*
DOCUMENTATION:

review = peer reviews,
taReviewReview = instructor grades & ta reviews,
rubric = the rubric (categories & explanations)

from JSON (in peerreview.js): 
  review = matchingData.review.reviewBody (matchingData <- `/api/peerReviews/${matchingId}`)
  taReviewReview = matchingData.reviewReview
  rubric = rubricData.rubric (rubricData <- `/api/rubrics/${rubricId}`)
*/

const PEER_INACTIVE_BAR_COLOR = "rgba(79, 38, 131, 0.4)"
const PEER_ACTIVE_BAR_COLOR = "rgba(79, 38, 131, 1.0)" 
const TA_INACTIVE_BAR_COLOR = "rgba(255, 198, 47, 0.4)"
const TA_ACTIVE_BAR_COLOR = "rgba(255, 198, 47, 1.0)"

const SubmissionCompleted = ({ instructor, taReviewReview, matchingId, dueDate, submission, isDocument, rubric, subId, review, disabled }) => {
  var gradingrubric = [];
  rubric.map((x) => gradingrubric.push(x));

  const taReviewReport = taReviewReview;
  const barChartEl = useRef()
  const [selectedComment, setSelectedComment] = useState([])

  const sendCommentToParent = (comment) => {
    setSelectedComment(comment)
  }

  // scroll new comment into view whenever selected comment changes
  useEffect(() => {
    let commentId = `${selectedComment[0]==0 ? "peer" : "ta"}-comment-${selectedComment[1]}`
    console.log(commentId)
    const comment = document.getElementById(commentId)
    console.log(comment)
    if (comment) {
      comment.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }

    // set timeout and remove class
    setTimeout(function() {
      if (comment) {
        comment.classList.remove(styles.selectedComment)
        comment.classList.add(styles.unselectedComment)
      }
    }, 2000)

  }, [selectedComment])

  return (
    <div className={styles.sub}>
    <Container>
    { (taReviewReport && taReviewReport.reviewBody) ?

      // if TA completed review, scores are shown in table below
      <Box bgcolor="#f73378">
        <br />
            <div className={styles.report}>
                Your peer review has been assessed as follows:
            </div>
            <br />
          <div className={styles.peerreviewscore}>
            Review Score: {_.sum(taReviewReport.reviewBody.map(({points}) => points))}
          </div>
            <br />
        <TableContainer component={Paper}>
            <Table aria-label='spanning table'>
              <TableHead>
                <TableRow>
                  <TableCell>Criteria <span className={styles.btw}></span></TableCell>
                  <TableCell align='center'>Comments</TableCell>
                  <TableCell align='center'>Scores</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {taReviewReport.reviewBody.map((row, index) => (
                  <TableRow key={`review-report-${index}`}>
                    {/* cells for criteria */}
                    <TableCell>
                        <div>
                          {row.element}
                        </div>
                    </TableCell>

                    {/* row for comments */}
                    <TableCell style={{ width: 600 }}>
                      <div className={`${styles.grader} ${styles.comments}`}>
                        {row.comment}
                      </div>
                    </TableCell>

                    {/* cells for grades */}
                    <TableCell style={{ width: 100 }} align='center'>
                      <div className={styles.grader}>
                        <nobr>{row.points} / {row.maxPoints}</nobr>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell className={styles.save} style={{ color: "black" }}>
                    <nobr>Total Score: {_.sum(taReviewReport.reviewBody.map(({points}) => points))} / {_.sum(taReviewReport.reviewBody.map(({maxPoints}) => maxPoints))}</nobr>
                  </TableCell>
                  <TableCell
                    id='submitted'
                    className={styles.save}
                    style={{ color: "green", display: "none" }}
                  >
                    Submitted
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
      </Box>
      :
      <div></div>
    }
    </Container>
    <br />
    <br />
    <Accordion defaultExpanded={true} className={styles.acc}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Submission {subId} (click to show/hide submission)
        </AccordionSummary>
        <AccordionDetails>
          {isDocument ? <iframe style={{ width:"100%",height:"100%",minHeight:"80vh"}} src={submission.s3Link}></iframe> : <Typography>{submission.s3Link}</Typography>}
        </AccordionDetails>
    </Accordion>
      <br />
      <br />
      <div className={styles.peerreviewreport}>
        { (taReviewReport && taReviewReport.instructorGrades)
          ? "Compare your review for this submission with the TA review below:"
          : "Your Review"
        }
      </div>
      <br />
      {Grading(gradingrubric, matchingId, review, disabled, taReviewReport)}
      <div className={styles.submissionData}>
        <div className={styles.chartContainer}>
          <p className={styles.commentInstructions}>Click on the Bar Graph to view the corresponding comment:</p>
          <BarChart 
            id="bar-chart" 
            chartData={formatChartData(rubric, review, taReviewReport)}
            passSelectedComment={sendCommentToParent} 
          />
          <div className={styles.scoresField}>
            <p>YOUR TOTAL SCORE: X / {getMaxScore(rubric)}</p>
            <p>TA TOTAL SCORE: X / {getMaxScore(rubric)}</p>
          </div>
        </div>
        <div className={styles.commentsField}>
          <SubmissionComments peerReview={review} taReview={taReviewReport} selectedComment={selectedComment} rubric={rubric}/>
        </div>
      </div>

    </div>
  );
}

export default SubmissionCompleted;

// manipulate the review data to display properly on the bar chart
const formatChartData = (rubric, peerReview, taReview) => {

  // labels and max points for each graded category
  const labels = rubric ? rubric.map(category => category.description) : []
  const maxPoints = rubric ? rubric.map(category => category.points) : []

  // the actual points data to display
  const peerGrades = peerReview ? peerReview.scores.map(score => score[0]) : []
  const taGrades = taReview && taReview.instructorGrades ? taReview.instructorGrades.map(score => score.points) : []

  // colors for the peer/ta bars
  const peerBackgroundColors = Array(peerGrades.length).fill(PEER_INACTIVE_BAR_COLOR)
  const taBackgroundColors = Array(peerGrades.length).fill(TA_INACTIVE_BAR_COLOR)

  // data to pass into bar chart component
  const chartProp = {
    labels: labels,
    datasets: [{
      label: "Peer Grade",
      data: peerGrades,
      backgroundColor: peerBackgroundColors,
      hoverBackgroundColor: [PEER_ACTIVE_BAR_COLOR],
      borderColor: PEER_ACTIVE_BAR_COLOR,
      borderWidth: 2,
      categoryPercentage: 0.8,
      barPercentage: 1.0,
      grouped: true,
    }, {
      label: "TA Grade",
      data: taGrades,
      backgroundColor: taBackgroundColors,
      hoverBackgroundColor: [TA_ACTIVE_BAR_COLOR],
      borderColor: TA_ACTIVE_BAR_COLOR,
      borderWidth: 2,
      categoryPercentage: 0.8,
      barPercentage: 1.0,
      grouped: true,
    }, {
      label: "Max Points",
      data: maxPoints,
      borderColor: "rgba(0, 0, 0, 1)",
      borderWidth: 0,
      categoryPercentage: 0.88,
      grouped: false,
    }
  ]
  };

  return chartProp;
};

// get the initial values from the peer reviews (the comments and grades given)
function getInitialValues(rubric, review) {
  var len = rubric.length;
  var comments = [];
  var grades = [];
  var finalcomment = "";
  if (review){
    for (var i = 0; i < len; i++) {
      comments.push(review.scores[i][1]);
      grades.push(review.scores[i][0]);
    }
  } else {
    for (var i = 0; i < len; i++) {
      comments.push("");
      grades.push(0);
    }
  }
  return { Grades: grades, Comments: comments, FinalComment: finalcomment };
}

// Helper Functions for grading calculations
function getMaxScore(rubric) {
  return _.sum(rubric.map(({points}) => points));
}

function getTotalScore(grades) {
  return _.sum(grades.map(s => s ? s : 0));
}

function getFinalScore(data, rubric) {
  var len = rubric.length;
  var body = { reviewBody: { scores: [], comments: [] } };
  for (var i = 0; i < len; i++) {
    body.reviewBody.scores.push([data.Grades[i], data.Comments[i]]);
  }
  body.reviewBody.comments = data.FinalComment;
  return body;
}

// Sub-component rendered inside of SubmissionCompleted
const Grading = (rubric, matching, review, disabled, taReviewReport) => {
  var initialValues = getInitialValues(rubric, review);
  var maxScore = getMaxScore(rubric);

  return (
    <Formik
      enableReinitialize= {true}
      initialValues={getInitialValues(rubric, review)}
      onSubmit={(data, { setSubmitting }) => {
        setSubmitting(true);
        axios.patch(`/api/peerReviews/${matching}`,{review: getFinalScore(data, rubric)}).then(res => {
          console.log('rubric post:', res);
          // setSubmitting(false);
          if (res.status === 200) {
            document.getElementById("submitted").innerHTML = "Submitted";
            document.getElementById("submitted").style.display = "";
          }
        });
      }}
    >
      {({ values, handleChange, dirty }) => (
          <TableContainer component={Paper}>
            <Table aria-label='spanning table'>
              <TableHead>
                <TableRow>
                  <TableCell>Criteria<br /><span className={styles.btw}>(Hover for details)</span></TableCell>
                  <TableCell align='center'>
                    Comments
                    <br />
                    {taReviewReport && taReviewReport.instructorGrades && <span className={`${styles.btw} ${styles.grader}`}>(TA Comments)</span>}
                  </TableCell>
                  <TableCell align='center'>
                    Scores
                    <br />
                    {taReviewReport && taReviewReport.instructorGrades && <span className={`${styles.btw} ${styles.grader}`}>(TA Scores)</span>}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rubric.map((row, index) => (
                  <React.Fragment key={`review-${index}`}>
                    <TableRow>
                      {/* cells for criteria */}
                      <TableCell>
                        <Tooltip title={row["long_description"]} placement="bottom">
                          <div>{row["description"]}</div>
                        </Tooltip>
                      </TableCell>

                      {/* row for comments */}
                      <TableCell style={{ width: 600 }}>
                        <div className={styles.comments}>
                          {initialValues.Comments[index]}
                        </div>
                      </TableCell>

                      {/* cells for grades */}
                      <TableCell style={{ width: 100 }} align='center'>
                        <div className={styles.details} ><nobr>{initialValues.Grades[index]} / {row["points"]}</nobr></div>
                      </TableCell>
                    </TableRow>
                    {
                      taReviewReport && taReviewReport.instructorGrades
                        ? (<TableRow>
                            <TableCell>
                              {/*<div className={styles.grader}>
                                TA Review
                              </div>
                              */}
                            </TableCell>

                            {/* col for comments */}
                            <TableCell style={{ width: 600 }}>
                              <div className={`${styles.comments} ${styles.grader}`}>
                                {taReviewReport.instructorGrades[index].comment}
                              </div>
                            </TableCell>

                            {/* cells for grades */}
                            <TableCell style={{ width: 100 }} align='center'>
                              <div className={`${styles.details} ${styles.grader}`}>
                                <nobr>{taReviewReport.instructorGrades[index].points} / {taReviewReport.instructorGrades[index].maxPoints}</nobr>
                              </div>
                            </TableCell>
                          </TableRow>)
                        : <div></div>
                    }
                  </React.Fragment>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell className={styles.save} style={{ color: "black" }}>
                    <nobr>Total Score: {getTotalScore(values.Grades)} / {maxScore}</nobr>
                  </TableCell>
                  <TableCell
                    id='submitted'
                    className={styles.save}
                    style={{ color: "green", display: "none" }}
                  >
                    Submitted
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
      )}
    </Formik>
  );
}
