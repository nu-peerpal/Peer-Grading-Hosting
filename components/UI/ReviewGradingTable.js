import React, { useState, useEffect } from "react";
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


const ReviewGradingTable = ({ values, errors, reviewRubric, userId, setIsRowOpen, setDoneGrading, doneGrading, presetComments, setPresetComments }) => {

  return (
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
        {reviewRubric.map(({ element, maxPoints }, i) => {
          const [comment, setComment] = useState('');
          const [presetter, setPresetter] = useState(false);
          function changeComment(e) {
            values[`${userId}`][i].comment = e.target.value;
            setComment(e.target.value);
          }
          return(
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
                value={comment == '' ? values[`${userId}`][i].comment : comment}
                onChange={changeComment}
              />
              {/* section for preset comments */}
              <div className={styles.preset}>
                <>
                <Button 
                onClick={()=>{
                  let newPresets = presetComments;
                  if (comment == '') {
                    newPresets.push(values[`${userId}`][i].comment);
                  } else {
                    newPresets.push(comment);
                  }
                  setPresetter(!presetter);
                  setPresetComments(newPresets);
                }}
                style={{background: "gray",
                      color: "black",
                      borderRadius: "5px",
                      margin: "2.5px 5px",
                      padding: "0 5px"}}>SAVE COMMENT AS PRESET
                      </Button>
                <Presets key={presetter} presetComments={presetComments} setComment={setComment}/>
                </>
              </div>

            </TableCell>
          </TableRow>
        )})}
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
  )};

  function Presets(props) {
      return props.presetComments.map( comment => {
        let commentAlias;
        if (comment.length < 30) {
          commentAlias = comment;
        } else {
          commentAlias = comment.substring(0,27) + "..."
        }
        
        return (
        <Button 
        onClick={()=>props.setComment(comment)}
        style={{background: "lightgray",
          color: "darkgray",
          borderRadius: "5px",
          margin: "2.5px 5px",
          padding: "0 5px"}}>{commentAlias}</Button>
        )})
  }

export default ReviewGradingTable;
