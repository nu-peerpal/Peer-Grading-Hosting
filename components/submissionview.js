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
const axios = require("axios");

class Submission extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    var gradingrubric = [];
    // console.log('sub rub:',this.props.rubric)
    this.props.rubric.map((x) => gradingrubric.push(x));
    return (
      <div className={styles.sub}>
        <Accordion defaultExpanded={true} className={styles.acc}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Submission {this.props.subId}
          </AccordionSummary>
          <AccordionDetails>
            {this.props.isDocument ? <iframe style={{ width:"100%",height:"100%",minHeight:"80vh"}} src={this.props.submission.s3Link}></iframe> : <Typography>{this.props.submission.s3Link}</Typography>}
          </AccordionDetails>
        </Accordion>
        <br />
        {Grading(gradingrubric, this.props.matchingId, this.props.review)}
      </div>
    );
  }
}

export default Submission;

  function getInitialValues(rubric, review) {
  // console.log({rubric});
  // console.log({review});
  
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
    score = score + grades[i];
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
function Grading(rubric, matching, review) {
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
          document.getElementById("submitted").style.display = "";
        });
        // fetch(`/api/peerReviews/${matching}`, {
        //   method: "PATCH",
        //   body: JSON.stringify(getFinalScore(data, rubric)),
        // });
      }}
    >
      {({ values, isSubmitting }) => (
        <Form>
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
                    <TableCell>
                    <Tooltip title={row["long_description"]} placement="bottom">
                      <p>{row["description"]}</p>
                      
                    </Tooltip>
                      
                    </TableCell>
                    <TableCell align='center' style={{ width: 600 }}>
                      <Field
                        name={"Comments[" + index + "]"}
                        type='input'
                        rowsMin={4}
                        value={values.Comments[index]}
                        id='outlined-basic'
                        variant='outlined'
                        required={true}
                        as={TextareaAutosize}
                        className={styles.pms}
                      />
                    </TableCell>
                    <TableCell style={{ width: 100 }} align='center'>
                      <Field
                        name={"Grades[" + index + "]"}
                        type='number'
                        value={values.Grades[index] || ""}
                        InputProps={{
                          inputProps: { min: 0, max: row["points"], step: 1 },
                        }}
                        id='outlined-basic'
                        variant='outlined'
                        required={true}
                        as={TextField}
                        className={styles.pms}
                      />
                      <br></br>/{row["points"]}
                    </TableCell>
                  </TableRow>
                ))}
                {/* <TableRow>
                    <TableCell>Comments:</TableCell>
                    <TableCell align="center" colspan="2">
                      <Field
                        name="Overall Comments"
                        type="input"
                        label="Overall Comments"
                        rowsMin={4}
                        value={values.FinalComment[0]}
                        id="outlined-basic"
                        variant="outlined"
                        required={true}
                        as={TextareaAutosize}
                        class={styles.pms}
                      />
                    </TableCell>
                  </TableRow> */}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell className={styles.save} style={{ color: "black" }}>
                    Total Score: {getTotalScore(values.Grades)} / {maxScore}
                  </TableCell>
                  <TableCell>
                    <Button
                      className={styles.save}
                      disabled={isSubmitting}
                      type='submit'
                    >
                      Save
                    </Button>
                  </TableCell>
                  <TableCell
                    id='submitted'
                    className={styles.save}
                    style={{ color: "black", display: "none" }}
                  >
                    Submitted
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Form>
      )}
    </Formik>
  );
}
