import React from "react";
import styles from "../styles/tagrading.module.scss";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Field } from "formik";
import { createGradeValidator } from "./PeerReviewMatrix";

const ReviewGradingTable = ({ values, errors, reviewRubric, userId, setIsRowOpen, setDoneGrading, doneGrading }) => (
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
                type="number"
                name={`${userId}[${i}]["points"]`}
                style={{ width: "60px" }}
                label="Points"
                value={values[`${userId}`][i].points}
                validate={createGradeValidator(maxPoints)}
              />
              {/* display error for grade validation */}
              {errors[`${userId}`] && errors[`${userId}`][i] && (
                <div className={styles.err}>
                  {errors[`${userId}`][i].points}
                </div>
              )}
            </TableCell>
            <TableCell>
              <Field
                as={TextField}
                multiline
                name={`${userId}[${i}]["comment"]`}
                style={{ width: "75%" }}
                rows={4}
                label="Comments"
                variant="outlined"
              />
            </TableCell>
          </TableRow>
        ))}
        <TableCell>
          <Button 
            onClick={()=>{
              setIsRowOpen(false);
              setDoneGrading(!doneGrading);
            }} 
            style={{ backgroundColor: (doneGrading) ? 'lightGray' : 'rgba(146, 25, 188, 0.34)'}}
          >
            {(doneGrading) ? 'MARK AS UNFINISHED' : 'MARK AS FINISHED'}
          </Button>
        </TableCell>
      </TableBody>
    </Table>
  </TableContainer>
);

export default ReviewGradingTable;
