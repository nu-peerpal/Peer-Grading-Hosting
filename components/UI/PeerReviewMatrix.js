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
import ReviewGradingTable from "./ReviewGradingTable";

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
          <TableContainer component={Paper} style={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ minWidth: "350px", fontSize: "16px" }}>
                    Rubric Element
                  </TableCell>
                  {peerMatchings.map(({ firstName, lastName }) => (
                    <TableCell style={{ minWidth: "350px", fontSize: "16px" }}>
                      {firstName} {lastName}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                <ReviewDisplayTable
                  rubric={assignmentRubric}
                  peerMatchings={peerMatchings}
                />
                <ReviewGradingTable
                  values={values}
                  rubric={reviewRubric}
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
