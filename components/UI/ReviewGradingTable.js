import React from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import { Field } from "formik";
import TextField from "@material-ui/core/TextField";

const ReviewGradingTable = ({ values, rubric, peerMatchings }) => (
  <>
    {rubric.map(({ element }, i) => (
      <TableRow key={element}>
        <TableCell>{element}</TableCell>
        {peerMatchings.map(({ user_id, maxPoints }) => (
          <TableCell>
            <Field
              as={TextField}
              type='number'
              InputProps={{
                inputProps: { min: 0, max: maxPoints, step: 1 },
              }}
              name={`user_${user_id}[${i}]["points"]`}
              style={{ width: "60px" }}
              label='Points'
              value={values[`user_${user_id}`][i].points}
            />
            <br />
            <br />
            <Field
              as={TextField}
              name={element}
              multiline
              name={`user_${user_id}[${i}]["comment"]`}
              style={{ width: "75%" }}
              rows={4}
              label='Comments'
              variant='outlined'
            />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);

export default ReviewGradingTable;
