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

class SubmissionCompleted extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    var gradingrubric = [];
    this.props.rubric.map((x) => gradingrubric.push(x));

    const taReviewReport = this.props.taReviewReview;
    console.log('taReviewReport:',taReviewReport);

    const isInstructor = this.props.instructor;
    console.log('isInstructor:',isInstructor);

    const viewPrAssessment = this.props.viewPeerReviewAssessment;

    console.log('this.props:',this.props);

    // testing for how comments look in paragraph form

    // taReviewReport["reviewBody"]["0"]["comment"] = 'This is a test to see how comments look in paragraph form. This is a test to see how comments look in paragraph form. This is a test to see how comments look in paragraph form. This is a test to see how comments look in paragraph form.'
    // taReviewReport["reviewBody"]["1"]["comment"] = 'This is a test to see how comments look in paragraph form. This is a test to see how comments look in paragraph form. This is a test to see how comments look in paragraph form. This is a test to see how comments look in paragraph form.'
    // taReviewReport["reviewBody"]["2"]["comment"] = 'This is a test to see how comments look in paragraph form. This is a test to see how comments look in paragraph form. This is a test to see how comments look in paragraph form. This is a test to see how comments look in paragraph form.'

    // taReviewReport["reviewBody"]["0"]["comment"] = 'c1'
    // taReviewReport["reviewBody"]["1"]["comment"] = 'c2'
    // taReviewReport["reviewBody"]["2"]["comment"] = 'c3'

    return (
      <div className={styles.sub}>
          <div>Peer Review Due Date: {this.props.dueDate} </div>
          <br />
          <br />
      <Container>
      {taReviewReport ?
        <Box bgcolor="#f73378">
          <br />
          {taReviewReport ?
              <div className={styles.report}>
                  Your peer review has been assessed as follows:
              </div>
              :
              null
          }
          {taReviewReport ?
              <br />
              :
              null
          }
          {taReviewReport ?
            <div className={styles.peerreviewscore}>
              Review Score: {(taReviewReport["reviewBody"]["0"]["points"] + taReviewReport["reviewBody"]["1"]["points"] + taReviewReport["reviewBody"]["2"]["points"])}
            </div>
            :
            <div className={styles.peerreviewscore}>
              Review Score: Ungraded
            </div>
          }
          {taReviewReport ?
              <br />
              :
              null
          }
          {taReviewReport ?
          <TableContainer component={Paper}>
              <Table aria-label='spanning table'>
                <TableHead>
                  <TableRow>
                    <TableCell>Criteria <span className={styles.btw}></span></TableCell>
                    <TableCell align='center'>Comments</TableCell>
                    <TableCell align='center'>Grade</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gradingrubric.map((row, index) => (
                    <TableRow key={row["description"]}>
                      {/* cells for criteria */}
                      <TableCell>
                          {index == 0 && taReviewReport ?
                              <div className={styles.tagradingcriteria}>
                                  {taReviewReport["reviewBody"]["0"]["element"]}
                              </div>
                              :
                              null
                          }
                          {index == 1 && taReviewReport ?
                              <div className={styles.tagradingcriteria}>
                                  {taReviewReport["reviewBody"]["1"]["element"]}
                              </div>
                              :
                              null
                          }
                          {index == 2 && taReviewReport ?
                              <div className={styles.tagradingcriteria}>
                                  {taReviewReport["reviewBody"]["2"]["element"]}
                              </div>
                              :
                              null
                          }
                      </TableCell>

                      {/* row for comments */}
                      <TableCell align='center' style={{ width: 600 }}>
                          {index == 0 && taReviewReport ?
                              <div className={styles.comments}>
                                  {taReviewReport["reviewBody"]["0"]["comment"]} 
                              </div>
                              :
                              null
                          }
                          {index == 1 && taReviewReport ?
                              <div className={styles.comments}>
                                  {taReviewReport["reviewBody"]["1"]["comment"]}  
                              </div>
                              :
                              null
                          }
                          {index == 2 && taReviewReport ?
                              <div className={styles.comments}>
                                  {taReviewReport["reviewBody"]["2"]["comment"]}  
                              </div>
                              :
                              null
                          }
                      </TableCell>

                      {/* cells for grades */}
                      <TableCell style={{ width: 100 }} align='center'>
                          {index == 0 && taReviewReport ?
                              <div className={styles.comments}>
                                  {taReviewReport["reviewBody"]["0"]["points"]} / {taReviewReport["reviewBody"]["0"]["maxPoints"]} 
                              </div>
                              :
                              null
                          }
                          {index == 1 && taReviewReport ?
                              <div className={styles.comments}>
                                  {taReviewReport["reviewBody"]["1"]["points"]} / {taReviewReport["reviewBody"]["1"]["maxPoints"]}  
                              </div>
                              :
                              null
                          }
                          {index == 2 && taReviewReport ?
                              <div className={styles.comments}>
                                  {taReviewReport["reviewBody"]["2"]["points"]} / {taReviewReport["reviewBody"]["2"]["maxPoints"]} 
                              </div>
                              :
                              null
                          }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                  {taReviewReport ?
                    <TableCell className={styles.save} style={{ color: "black" }}>
                      Total Score: {(taReviewReport["reviewBody"]["0"]["points"] + taReviewReport["reviewBody"]["1"]["points"] + taReviewReport["reviewBody"]["2"]["points"])} / {(taReviewReport["reviewBody"]["0"]["maxPoints"] + taReviewReport["reviewBody"]["1"]["maxPoints"] + taReviewReport["reviewBody"]["2"]["maxPoints"])}
                    </TableCell>
                    :
                    null
                  }
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
            :
            null
          }
        </Box>
        :
        <div className={styles.ungradedreport}>
          Peer review has not been graded yet
        </div>
      }
      </Container>
        <br />
        <br />
        {taReviewReport ?
          <div className={styles.comparestatement}>
            Compare your peer review for this submission with the TA's review below
          </div>
          :
          null
        }
        {taReviewReport ?
          <br />
          :
          null
        }
        <br />
        <Accordion defaultExpanded={true} className={styles.acc}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Submission {this.props.subId} (click to show submission)
          </AccordionSummary>
          <AccordionDetails>
            {this.props.isDocument ? <iframe style={{ width:"100%",height:"100%",minHeight:"80vh"}} src={this.props.submission.s3Link}></iframe> : <Typography>{this.props.submission.s3Link}</Typography>}
          </AccordionDetails>
        </Accordion>
        <br />
        <br />
        <div className={styles.peerreviewreport}>
            Completed Peer Review
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
  // console.log({grades})
  return { Grades: grades, Comments: comments, FinalComment: finalcomment };
}

function getMaxScore(rubric) {
  var len = rubric.length;
  var score = 0;
  for (var i = 0; i < len; i++) {
    score = score + rubric[i]["points"];
  }
  return score;
}

function getTotalScore(grades) {
  var len = grades.length;
  var score = 0;
  for (var i = 0; i < len; i++) {
    score = score + (grades[i] ? grades[i] : 0);
  }
  return score;
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

// console.log('what reviews should look like', js.reviews[0])
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
        // fetch(`/api/peerReviews/${matching}`, {
        //   method: "PATCH",
        //   body: JSON.stringify(getFinalScore(data, rubric)),
        // });
      }}
    >
      {({ values, handleChange, dirty }) => (
          <TableContainer component={Paper}>
            <Table aria-label='spanning table'>
              <TableHead>
                <TableRow>
                  <TableCell>Criteria <span className={styles.btw}>(Hover for details)</span></TableCell>
                  <TableCell align='center'>Comments</TableCell>
                  <TableCell align='center'>Grade</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rubric.map((row, index) => (
                  <TableRow key={row["description"]}>
                    {/* cells for criteria */}
                    <TableCell>
                      <Tooltip title={row["long_description"]} placement="bottom">
                        <p>{row["description"]}</p>
                      </Tooltip>
                    </TableCell>

                    {/* row for comments */}
                    <TableCell align='center' style={{ width: 600 }}>
                      <div>{initialValues.Comments[index]}</div>
                      <div className={styles.details}>
                        <br />
                        {index == 0 && taReviewReport ?
                            <div className={styles.comments}>
                            TA Comments: {taReviewReport["instructorGrades"]["0"]["comment"]}
                            </div>
                            :
                            null
                        }
                        {index == 1 && taReviewReport ?
                            <div className={styles.comments}>
                            TA Comments: {taReviewReport["instructorGrades"]["1"]["comment"]}
                            </div>
                            :
                            null
                        }
                        {index == 2 && taReviewReport ?
                            <div className={styles.comments}>
                            TA Comments: {taReviewReport["instructorGrades"]["2"]["comment"]}
                            </div>
                            :
                            null
                        }
                        </div>
                    </TableCell>

                    {/* cells for grades */}
                    <TableCell style={{ width: 100 }} align='center'>
                      <div>{initialValues.Grades[index]} / {row["points"]}</div>
                      <br />
                        {index == 0 && taReviewReport ?
                            <div className={styles.comments}>
                            TA Grade: {taReviewReport["instructorGrades"]["0"]["points"]} / {taReviewReport["instructorGrades"]["0"]["maxPoints"]}
                            </div>
                            :
                            null
                        }
                        {index == 1 && taReviewReport ?
                            <div className={styles.comments}>
                            TA Grade: {taReviewReport["instructorGrades"]["1"]["points"]} / {taReviewReport["instructorGrades"]["1"]["maxPoints"]}
                            </div>
                            :
                            null
                        }
                        {index == 2 && taReviewReport ?
                            <div className={styles.comments}>
                            TA Grade: {taReviewReport["instructorGrades"]["2"]["points"]} / {taReviewReport["instructorGrades"]["2"]["maxPoints"]}
                            </div>
                            :
                            null
                        }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell className={styles.save} style={{ color: "black" }}>
                    Total Score: {getTotalScore(values.Grades)} / {maxScore}
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
