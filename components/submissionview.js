import React from "react";
import styles from "./styles/submissionview.module.scss";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Field, Formik, Form } from "formik";
import TextField from "@material-ui/core/TextField";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const fetcher = (url) => fetch(url, { method: "POST" }).then((r) => r.json());

class Submission extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    var gradingrubric = [];
    this.props.rubric.map((x) => gradingrubric.push(x));
    // console.log('what do i look like', gradingrubric)
    return (
      <div class={styles.sub}>
        <Accordion class={styles.acc}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            User 1's Submission
          </AccordionSummary>
          <AccordionDetails>
            <iframe style={{ width:"100%",height:"100%",minHeight:"80vh"}} src={this.props.sublink}></iframe>
          </AccordionDetails>
        </Accordion>
        <br />
        {Grading(gradingrubric)}
      </div>
    );
  }
}

export default Submission;

function getInitialValues(rubric) {
  var len = rubric.length;
  var comments = [];
  var grades = [];
  var finalcomment = "";
  for (var i = 0; i < len; i++) {
    comments.push("");
    grades.push(0);
  }
  return { Grades: grades, Comments: comments, FinalComment: finalcomment };
}

function getMaxScore(rubric) {
  var len = rubric.length;
  var score = 0;
  for (var i = 0; i < len; i++) {
    score = score + rubric[i][0];
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

var js = {
  graders: [3, 1, 2],
  reviews: [
    [
      11,
      112,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      11,
      118,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      12,
      119,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      12,
      114,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      13,
      112,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      13,
      118,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      14,
      113,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      14,
      120,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      15,
      119,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      15,
      114,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      16,
      115,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      16,
      113,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      17,
      118,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      17,
      116,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      18,
      114,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      18,
      111,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      19,
      113,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      19,
      117,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      20,
      117,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      20,
      113,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      1,
      114,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      2,
      118,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      3,
      113,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      1,
      115,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      2,
      120,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      2,
      111,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      3,
      116,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
  ],
  rubric: [
    [50, "Content"],
    [50, "Writing Quality"],
  ],
};
// console.log('what reviews should look like', js.reviews[0])
function Grading(rubric) {
  var maxScore = getMaxScore(rubric);
  return (
    <Formik
      initialValues={getInitialValues(rubric)}
      onSubmit={(data, { setSubmitting }) => {
        setSubmitting(true);
        fetch("/api/peerReviews/detailedView?id=4", {
          method: "POST",
          body: JSON.stringify(getFinalScore(data, rubric)),
        });
        setSubmitting(false);
        document.getElementById("submitted").style.display = "";
      }}
    >
      {({ values, isSubmitting }) => (
        <Form>
          <TableContainer component={Paper}>
            <Table aria-label='spanning table'>
              <TableHead>
                <TableRow>
                  <TableCell>Criteria</TableCell>
                  <TableCell align='center'>Comments</TableCell>
                  <TableCell align='center'>Grade</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rubric.map((row, index) => (
                  <TableRow key={row[1]}>
                    <TableCell>{row[1]}</TableCell>
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
                        class={styles.pms}
                      />
                    </TableCell>
                    <TableCell style={{ width: 100 }} align='center'>
                      <Field
                        name={"Grades[" + index + "]"}
                        type='number'
                        value={values.Grades[index] || ""}
                        InputProps={{
                          inputProps: { min: 0, max: row[0], step: 1 },
                        }}
                        id='outlined-basic'
                        variant='outlined'
                        required={true}
                        as={TextField}
                        class={styles.pms}
                      />
                      <br></br>/{row[0]}
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
                  <TableCell class={styles.save} style={{ color: "black" }}>
                    Total Score: {getTotalScore(values.Grades)} / {maxScore}
                  </TableCell>
                  <TableCell>
                    <Button
                      class={styles.save}
                      disabled={isSubmitting}
                      type='submit'
                    >
                      Save
                    </Button>
                  </TableCell>
                  <TableCell
                    id='submitted'
                    class={styles.save}
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
