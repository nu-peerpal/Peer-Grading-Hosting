import React from "react";
import styles from "./styles/submissionview.module.scss";
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
import { palette } from '@material-ui/system';
const axios = require("axios");
import _ from "lodash";

class SubmissionCompleted extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    var gradingrubric = [];
    this.props.rubric.map((x) => gradingrubric.push(x));

    const taReviewReport = this.props.taReviewReview;

    console.log({taReviewReport});

    return (
      <div className={styles.sub}>
      <Container>
      { (taReviewReport && taReviewReport.reviewBody) ?
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
        null
      }
      </Container>
      <br />
      <br />
      <Accordion defaultExpanded={true} className={styles.acc}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Submission {this.props.subId} (click to show/hide submission)
          </AccordionSummary>
          <AccordionDetails>
            {this.props.isDocument ? <iframe style={{ width:"100%",height:"100%",minHeight:"80vh"}} src={this.props.submission.s3Link}></iframe> : <Typography>{this.props.submission.s3Link}</Typography>}
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
        {Grading(gradingrubric, this.props.matchingId, this.props.review, this.props.disabled, taReviewReport)}
      </div>
    );
  }
}

export default SubmissionCompleted;

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

function Grading(rubric, matching, review, disabled, taReviewReport) {
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
                        : null
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
