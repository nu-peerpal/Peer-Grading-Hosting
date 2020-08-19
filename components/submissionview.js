import React from "react";
import styles from "./styles/submissionview.module.css";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Field, Formik, Form } from "formik";
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from "@material-ui/core/TextareaAutosize"
import Button from '@material-ui/core/Button'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import getRubric from '../pages/getRubric.js'

class Submission extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // :[
      //   {'name': '', 'info':""},
      //   {'name': '', 'info':""},
      // ],
    }
  }
  render() {
    return (
      <div className={styles.sub}>
        <Accordion className={styles.acc}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            User 1's Submission
                    </AccordionSummary>
          <AccordionDetails>
          </AccordionDetails>
        </Accordion>
        <br />
        <Grading />
      </div>
    )
  }
}

export default Submission;


//const rubric = [[5,"accuracy"],[5,"creativity"]]
var rubric = [[10,"Answer/Algorithm"],[10,"Proof Analysis"],[10,"Clarity"]]

function getInitialValues(rubric){
  //console.log("rubric", getRubric(1,7))
  var len = rubric.length
  var comments = []
  var grades = []
  for(var i = 0; i < len; i++) {
    comments.push("")
    grades.push(0)
  } 
  return { Grades: grades, Comments: comments}
}
function getMaxScore(rubric){
  var len = rubric.length
  var score = 0
  for(var i = 0; i < len; i++) {
     score = score + rubric[i][0]
  } 
  return score
}

function getTotalScore(grades){
  var len = grades.length
  var score = 0
  for(var i = 0; i < len; i++) {
     score = score + grades[i]
  } 
  return score
}

function Grading() {
  var maxScore = getMaxScore(rubric)
  return (
    <Formik
      initialValues={ getInitialValues(rubric) }
      onSubmit={(data, { setSubmitting }) => {
        setSubmitting(true);
        console.log(data)
        setSubmitting(false);
        document.getElementById('submitted').style.display=''
      }}>
      {({ values, isSubmitting }) =>
        (
          <Form>
            <TableContainer component={Paper}>
              <Table aria-label="spanning table">
                <TableHead>
                  <TableRow>
                    <TableCell>Criteria</TableCell>
                    <TableCell align="center">Grade</TableCell>
                    <TableCell align="center">Comments</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rubric.map((row,index) => (
                    <TableRow key={row[1]}>
                      <TableCell>{row[1]}</TableCell>
                      <TableCell style={{ width: 80 }} align="center">
                        <Field
                          name={"Grades["+index+"]"}
                          type="number"
                          value={values.Grades[index]}
                          InputProps={{ inputProps: { min: 0, max: row[0], step: 1} }}
                          id="outlined-basic"
                          variant="outlined"
                          required={true}
                          as={TextField}
                          className={styles.pms}
                        />
                        <br></br>/{row[0]}
                      </TableCell>
                      <TableCell align="center" style={{ width: 600 }}>
                        <Field
                          name={"Comments["+index+"]"}
                          type="input"
                          rowsMin = {4}
                          value={values.Comments[index]}
                          id="outlined-basic"
                          variant="outlined"
                          required={true}
                          as={TextareaAutosize}
                          className={styles.pms}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell className = {styles.save} style = {{color:"black"}}  >
                      Total Score: { getTotalScore(values.Grades)} / {maxScore}
                      </TableCell>
                      <TableCell>
                          <Button className={styles.save} disabled={isSubmitting}  type="submit">Save</Button>
                      </TableCell>
                      <TableCell id = "submitted" className = {styles.save} style={{color:"black", display:"none"}}>
                      Submitted
                      </TableCell>
                  </TableRow>
                  </TableFooter>
              </Table>
            </TableContainer>
          </Form>
        )
      }
    </Formik >
  )
}