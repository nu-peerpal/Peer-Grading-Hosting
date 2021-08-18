import React, { useState, useEffect } from "react";
import styles from "../styles/tagrading.module.scss";
import { Formik, Form, Field } from "formik";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ReviewDisplayTable from "./ReviewDisplayTable";
const axios = require("axios");
// import SubmitButton from '../submitButton';

export const createGradeValidator = maxPoints => {
  return value => {
    let error;
    if (value < 0 || value > maxPoints) {
      error = `Should be between 0 and ${maxPoints} pts`;
    }
    return error;
  };
};

const getInitialValues = (assignmentRubric, peerMatchings, reviewRubric) => {
  const values = {};
  let instructorGrades;
  peerMatchings.forEach(matching => {
    let key = matching.userId
    if (matching.reviewReview) {
      values[key] = matching.reviewReview.reviewBody;
      if (!instructorGrades) { // set instructor grades the first time we find a reviewreview
        instructorGrades = matching.reviewReview.instructorGrades;
        values.instructorGrades = assignmentRubric.map((section, i) => ({
          ...section,
          points: instructorGrades[i].points,
          comment: instructorGrades[i].comment
        }));
      }
    } else {
      values[key] = reviewRubric.map(section => ({
        ...section,
        points: 0,
        comment: ""
      }));
      if (!values.instructorGrades) {
        values.instructorGrades = assignmentRubric.map(section => ({
          ...section,
          points: 0,
          comment: ""
        }));
      }
    }
  })

  return values;
};

const PeerReviewMatrix = ({
  peerMatchings,
  assignmentRubric,
  reviewRubric,
  presetComments,
  setPresetComments
}) => {
  const [upvotedGrades, setUpvotedGrades] = useState(null);
  useEffect(() => {
    const initUpvotedGrades = {};
    for (const { element } of assignmentRubric) {
      initUpvotedGrades[element] = [];
    }
    setUpvotedGrades(initUpvotedGrades);
  }, [assignmentRubric]);

  const averageUpvotes = element =>
    parseFloat(
      (
        upvotedGrades[element].reduce((acc, { points }) => acc + points, 0) /
        upvotedGrades[element].length
      ).toFixed(1)
    );

  // initialValues available to child component props as
  // values, as well as isSubmitting (boolean state for submission)
  return (
    peerMatchings.length > 0 &&
    assignmentRubric.length > 0 &&
    reviewRubric.length > 0 && (
      <Formik
        initialValues={getInitialValues(
          assignmentRubric,
          peerMatchings,
          reviewRubric
        )}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          peerMatchings.forEach(async matching => {
            await axios.patch(`/api/peerReviews/${matching.matchingId}`,{reviewReview: {reviewBody: values[matching.userId], instructorGrades: values.instructorGrades}}).then(res => {
              console.log('rubric post:', res);
              if (res.status === 200) {
                document.getElementById("submitted").innerHTML = "Submitted";
                document.getElementById("submitted").style.display = "";
              } else {
                document.getElementById("submitted").innerHTML = "Submission failed.";
                document.getElementById("submitted").style.display = "";
              }
            });
          });
          setSubmitting(false);
          
        }}
      >
        {({ errors, values, setValues }) => (
          <Form>
            <TableContainer component={Paper}>
              <Table style={{ minWidth: "1100px", overflowX: "hidden" }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Rubric Element</TableCell>
                    {assignmentRubric.map(({ element }) => (
                      <TableCell>{element}</TableCell>
                    ))}
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <ReviewDisplayTable
                    values={values}
                    errors={errors}
                    assignmentRubric={assignmentRubric}
                    reviewRubric={reviewRubric}
                    peerMatchings={peerMatchings}
                    state={[upvotedGrades, setUpvotedGrades]}
                    presetComments={presetComments}
                    setPresetComments={setPresetComments}
                  />

                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Instructor Grades
                    </TableCell>
                    {assignmentRubric.map(({ element, maxPoints }, i) => (
                      <TableCell style={{ position: "relative" }}>
                        <Field
                          as={TextField}
                          type="number"
                          name={`instructorGrades[${i}]["points"]`}
                          style={{ width: "60px" }}
                          value={values.instructorGrades[i].points}
                          label="Points"
                          validate={createGradeValidator(maxPoints)}
                        />

                        {/* display error for grade validation */}
                        {errors.instructorGrades &&
                          errors.instructorGrades[i] && (
                            <div className={styles.err}>
                              {errors.instructorGrades[i].points}
                            </div>
                          )}

                        {/* button to copy over upvote avg */}
                        <div
                          className={styles.copyavg}
                          onClick={() => {
                            const upvoteAvg = averageUpvotes(element);
                            if (!Number.isNaN(upvoteAvg)) {
                              const { instructorGrades } = values;
                              instructorGrades[i].points = upvoteAvg;
                              setValues({ ...values, instructorGrades });
                            }
                          }}
                        >
                          <IconButton
                            size="small"
                            disabled={Number.isNaN(averageUpvotes(element))}
                          >
                            <ArrowBackIcon fontSize="small" />
                          </IconButton>
                        </div>

                        <div className={styles.upvoteavg}>
                          <Typography align="right" variant="subtitle2">
                            Upvote Average
                          </Typography>
                          <Typography align="right" variant="body2">
                            {Number.isNaN(averageUpvotes(element))
                              ? "N/A"
                              : averageUpvotes(element)}
                          </Typography>
                        </div>

                        <br />
                        <br />
                        <Field
                          as={TextField}
                          multiline
                          name={`instructorGrades[${i}]["comment"]`}
                          style={{ width: "90%" }}
                          rows={4}
                          label="Comments"
                          value={values.instructorGrades[i].comment}
                          variant="outlined"
                        />
                      </TableCell>
                    ))}
                    <TableCell style={{ fontWeight: "bold" }}>
                      {values.instructorGrades.reduce(
                        (acc, section) =>
                          acc + (section.points ? section.points : 0),
                        0
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>

                <TableFooter>
                  <Button type="submit">Save</Button>
                  <div style={{display: "none"}} id="submitted"></div>
                </TableFooter>
              </Table>
            </TableContainer>
          </Form>
        )}
      </Formik>
    )
  );
};

export default PeerReviewMatrix;
