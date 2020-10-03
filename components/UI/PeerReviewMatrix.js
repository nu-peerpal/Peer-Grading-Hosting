import React from "react";
import { Formik, Form } from "formik";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import ReviewDisplayTable from "./ReviewDisplayTable";

const getInitialValues = (peerMatchings, reviewRubric) => {
  const values = {};
  for (const { user_id } of peerMatchings) {
    const key = "user_" + user_id;
    values[key] = reviewRubric.map((section) => ({
      ...section,
      points: 0,
      comment: "",
    }));
  }
  return values;
};

const PeerReviewMatrix = ({
  peerMatchings,
  assignmentRubric,
  reviewRubric,
}) => {
  // initialValues available to child component props as
  // values, as well as isSubmitting (boolean state for submission)
  return (
    <Formik
      initialValues={getInitialValues(peerMatchings, reviewRubric)}
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
                />
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
