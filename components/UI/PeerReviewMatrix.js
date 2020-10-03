import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import ReviewDisplayTable from "./ReviewDisplayTable";

const getInitialValues = (assignmentRubric, peerMatchings, reviewRubric) => {
  const values = {};
  for (const { user_id } of peerMatchings) {
    const key = "user_" + user_id;

    values[key] = reviewRubric.map((section) => ({
      ...section,
      points: 0,
      comment: "",
    }));
  }

  values.instructorGrades = assignmentRubric.map((section) => ({
    ...section,
    points: 0,
    comment: "",
  }));

  return values;
};

const PeerReviewMatrix = ({
  peerMatchings,
  assignmentRubric,
  reviewRubric,
  upvotesAveraged,
}) => {
  const initUpvotedGrades = {};
  for (const { element } of assignmentRubric) {
    initUpvotedGrades[element] = [];
  }
  const [upvotedGrades, setUpvotedGrades] = useState(initUpvotedGrades);

  const averageUpvotes = (element) =>
    parseFloat(
      (
        upvotedGrades[element].reduce((acc, { points }) => acc + points, 0) /
        upvotedGrades[element].length
      ).toFixed(1)
    );

  // initialValues available to child component props as
  // values, as well as isSubmitting (boolean state for submission)
  return (
    <Formik
      initialValues={getInitialValues(
        assignmentRubric,
        peerMatchings,
        reviewRubric
      )}
      onSubmit={(values, { setSubmitting }) => {
        console.log(values);
      }}
    >
      {({ values, isSubmitting }) => (
        <Form>
          <TableContainer component={Paper}>
            <Table>
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
                  assignmentRubric={assignmentRubric}
                  reviewRubric={reviewRubric}
                  peerMatchings={peerMatchings}
                  state={[upvotedGrades, setUpvotedGrades]}
                />

                <TableRow>
                  <TableCell style={{ fontWeight: "bold" }}>
                    Instructor Grades
                  </TableCell>
                  {assignmentRubric.map(({ element, maxPoints }, i) => (
                    <TableCell>
                      <Field
                        as={TextField}
                        type='number'
                        name={`instructorGrades[${i}]["points"]`}
                        style={{ width: "60px" }}
                        value={(() => {
                          if (upvotesAveraged) {
                            values.instructorGrades[i].points = averageUpvotes(
                              element
                            );
                          }
                          return values.instructorGrades[i].points;
                        })()}
                        label='Points'
                      />
                      <br />
                      <br />
                      <Field
                        as={TextField}
                        multiline
                        name={`instructorGrades[${i}]["comment"]`}
                        style={{ width: "90%" }}
                        rows={4}
                        label='Comments'
                        value={values.instructorGrades[i].comment}
                        variant='outlined'
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
                <Button type='submit'>Save</Button>
              </TableFooter>
            </Table>
          </TableContainer>
        </Form>
      )}
    </Formik>
  );
};

export default PeerReviewMatrix;
