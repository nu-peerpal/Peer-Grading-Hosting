import React, { useState, useEffect } from "react";
import styles from "../styles/submissionview.module.scss";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Field, Formik, Form } from "formik";
import TextField from "@material-ui/core/TextField";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Typography from '@material-ui/core/Typography';
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Tooltip from '@material-ui/core/Tooltip';
import {formatPrefix} from "../apiCallUtils";
import {useUserData} from "../storeAPI";
const axios = require("axios");

// console.log('what reviews should look like', js.reviews[0])
function Grading(props) {
  const {rubric, matching, disabled} = props;
  const [reviewData,setReviewData] = useState(null);
  const { userId } = useUserData();

  useEffect(() => {
    axios.get(formatPrefix(props.ISstudent, userId) + `peerReviews/${matching}`).then(res => {
      let review = res.data.data.review;
      setReviewData(getInitialValues(rubric, (review) ? review.reviewBody : null));
    });
 }, []);

 var maxScore = getMaxScore(rubric);

 if (!reviewData)
   return null;

 return (
   <Formik
     enableReinitialize= {true}
     initialValues={reviewData}
     onSubmit={(data, actions) => {
       axios.patch(formatPrefix(props.ISstudent, userId) + `peerReviews/${matching}`,{review: getFinalScore(data, rubric)}).then(res => {
         console.log('review post:', res);
         actions.setSubmitting(false);
         // if (res.status === 201) {
         //   document.getElementById("submitted").innerHTML = "Submitted";
         //   document.getElementById("submitted").style.display = "";
         // }
         actions.resetForm({values: data});
         setReviewData(data);
       });
       // fetch(`/api/peerReviews/${matching}`, {
       //   method: "PATCH",
       //   body: JSON.stringify(getFinalScore(data, rubric)),
       // });
     }}
   >
     {({ values, handleChange, handleSubmit, dirty }) => (
       <Form onSubmit={handleSubmit} >
         <TableContainer component={Paper}>
           <Table aria-label='spanning table'>
             <TableHead>
               <TableRow>
                 <TableCell>Criteria</TableCell>
                 <TableCell align='center'>Comments</TableCell>
                 <TableCell align='center'>Grade</TableCell>
               </TableRow>
             </TableHead>
             <TableBody>
               {rubric.map((row, index) => (
                 <TableRow key={row["description"]}>
                   {/* cells for criteria */}
                   <TableCell>
                     <Tooltip title={row["long_description"]} placement="bottom">
                       <p>{row["description"]}<br /><span className={styles.btw}>(Hover for details)</span></p>
                     </Tooltip>
                   </TableCell>

                   {/* row for comments */}
                   <TableCell align='center' style={{ width: 600 }}>
                     <Field
                       name={"Comments[" + index + "]"}
                       type='input'
                       rowsMin={4}
                       value={values.Comments[index]}
                       onKeyUp={handleChange}
                       id='outlined-basic'
                       variant='outlined'
                       required={true}
                       as={TextareaAutosize}
                       className={styles.pms}
                       disabled={disabled}
                     />
                   </TableCell>

                   {/* cells for grades */}
                   <TableCell style={{ width: 100 }} align='center'>
                     <Field
                       name={"Grades[" + index + "]"}
                       type='number'
                       value={values.Grades[index]}
                       onKeyUp={handleChange}
                       InputProps={{
                         inputProps: { min: 0, max: row["points"], step: 0.1 },
                       }}
                       id='outlined-basic'
                       variant='outlined'
                       required={true}
                       as={TextField}
                       className={styles.pms}
                       disabled={disabled}
                     />
                     <br></br>/{row["points"]}
                   </TableCell>
                 </TableRow>
               ))}
               {/* <TableRow>
                   <TableCell>Comments:</TableCell>
                   <TableCell align="center" colspan="2">
                     <Field
                       name="Overall Comments"
                       type="input"
                       label="Overall Comments"
                       rowsMin={4}
                       value={values.FinalComment[0]}
                       id="outlined-basic"
                       variant="outlined"
                       required={true}
                       as={TextareaAutosize}
                       class={styles.pms}
                     />
                   </TableCell>
                 </TableRow> */}
             </TableBody>
             <TableFooter>
               <TableRow>
                 <TableCell className={styles.save} style={{ color: "black" }}>
                   Total Score: {getTotalScore(values.Grades)} / {maxScore}
                 </TableCell>
                 <TableCell>
                   <Button
                     className={styles.save}
                     disabled={(!dirty && disabled)}
                     type='submit'
                   >
                     Save
                   </Button>
                 </TableCell>
                 { (dirty) ?
                   <TableCell
                     className={styles.save}
                     style={{ color: "red" }}
                   >
                     not saved
                   </TableCell>
                 :
                   <TableCell
                     className={styles.save}
                     style={{ color: "green" }}
                   >
                     saved
                   </TableCell>
                 }
               </TableRow>
             </TableFooter>
           </Table>
         </TableContainer>
       </Form>
     )}
   </Formik>
 );
}

class Submission extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const {rubric,matchingId,disabled,ISstudent} = this.props;

    // shallow cop
//    var gradingrubric = [...this.props.rubric || []];

    return (
      <div className={styles.sub}>
        <Accordion defaultExpanded={true} className={styles.acc}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Submission {this.props.subId} (click to show/hide submission)
          </AccordionSummary>
          <AccordionDetails>
            {this.props.isDocument ? <iframe style={{ width:"100%",height:"100%",minHeight:"80vh"}} src={this.props.submission.s3Link}></iframe> : <Typography>{this.props.submission.s3Link}</Typography>}
          </AccordionDetails>
        </Accordion>
        <br />
        {!rubric || <Grading rubric={rubric} matching={matchingId} disabled={disabled} ISstudent={ISstudent} />}
      </div>
    );
  }
}

export default Submission;

function getInitialValues(rubric, review) {
  var len = rubric.length;
  var comments = [];
  var grades = [];
  var finalcomment = "";
  if (review){
    for (var i = 0; i < len; i++) {
      comments.push(review.scores[i][1]);
      grades.push(review.scores[i][0]);
    }
  } else {
    for (var i = 0; i < len; i++) {
      comments.push("");
      grades.push(0);
    }
  }
  // console.log({grades})
  return { Grades: grades, Comments: comments, FinalComment: finalcomment };
}

function getMaxScore(rubric) {
  var len = rubric.length;
  var score = 0;
  for (var i = 0; i < len; i++) {
    score = score + rubric[i]["points"];
  }
  return score;
}

function getTotalScore(grades) {
  var len = grades.length;
  var score = 0;
  for (var i = 0; i < len; i++) {
    score = score + (grades[i] ? grades[i] : 0);
  }
  return score;
}

function getFinalScore(data, rubric) {
  var len = rubric.length;
  var body = { reviewBody: { scores: [], comments: [] } };
  for (var i = 0; i < len; i++) {
    body.reviewBody.scores.push([data.Grades[i], data.Comments[i]]);
  }
  body.reviewBody.comments = data.FinalComment;
  console.log({finalComment:body.reviewBody.comments});
  return body;
}
