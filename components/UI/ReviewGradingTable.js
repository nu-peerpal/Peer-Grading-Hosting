import React from "react";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import { Field } from "formik";
import TextField from "@material-ui/core/TextField";

const ReviewGradingTable = ({ values, reviewRubric, userId }) => (
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
            <TableCell>
              <Field
                as={TextField}
                type='number'
                InputProps={{
                  inputProps: { min: 0, max: maxPoints, step: 1 },
                }}
                name={`user_${userId}[${i}]["points"]`}
                style={{ width: "60px" }}
                label='Points'
                value={values[`user_${userId}`][i].points}
              />
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
