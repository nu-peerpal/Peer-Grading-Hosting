import React from "react";
import styles from "../styles/tagrading.module.css";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TextField from "@material-ui/core/TextField";
import { Field } from "formik";
import { createGradeValidator } from "./PeerReviewMatrix";

const ReviewGradingTable = ({ values, errors, reviewRubric, userId }) => (
  <TableContainer style={{ backgroundColor: "rgb(248,248,248)" }}>
    <Table>
      <TableHead>
        <TableCell style={{ paddingLeft: "80px" }}>
          Peer Review Criteria
        </TableCell>
        <TableCell>Grade</TableCell>
        <TableCell>Comments</TableCell>
      </TableHead>
      <TableBody>
        {reviewRubric.map(({ element, maxPoints }, i) => (
          <TableRow>
            <TableCell style={{ paddingLeft: "80px" }}>{element}</TableCell>
            <TableCell style={{ position: "relative" }}>
              <Field
                as={TextField}
                type='number'
                name={`user_${userId}[${i}]["points"]`}
                style={{ width: "60px" }}
                label='Points'
                value={values[`user_${userId}`][i].points}
                validate={createGradeValidator(maxPoints)}
              />
              {/* display error for grade validation */}
              {errors[`user_${userId}`] && errors[`user_${userId}`][i] && (
                <div className={styles.err}>
                  {errors[`user_${userId}`][i].points}
                </div>
              )}
            </TableCell>
            <TableCell>
              <Field
                as={TextField}
                name={element}
                multiline
                name={`user_${userId}[${i}]["comment"]`}
                style={{ width: "75%" }}
                rows={4}
                label='Comments'
                variant='outlined'
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default ReviewGradingTable;
