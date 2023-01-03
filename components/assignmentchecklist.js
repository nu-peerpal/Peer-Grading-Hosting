import React, { useState, useEffect } from "react";
import Link from 'next/link'
import styles from './styles/assignmentchecklist.module.scss'
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Switch from '@material-ui/core/Switch';
import axios from 'axios';


const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%"
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  actionsContainer: {
    marginBottom: theme.spacing(2)
  },
  resetContainer: {
    padding: theme.spacing(3)
  }
}));


function formatTimestamp(timestamp) {
  var d = new Date(timestamp);
  return ((d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear());

}
function getSteps() {
  return [
    ["Initialize: ", { 'link': '/assignments/initialchecklist/initialchecklist' }],
    ["Assignment Due Date: ", { 'date': "status" }],
    ["Peer Matching: ", { 'link': "/assignments/matching/matching" }],
    ["Review Due Date: ", { 'date': "status" }],
    ["Additional Matches: ", { 'link': "/assignments/checkmatching" }],
    ["TA Grading: ", { 'link': "/grading/selectTaGrading" }],
    ["Review and Submission Reports: ", { 'link': "/assignments/reportlist/reportlist" }],
    ["Appeals: ", { 'link': "/assignments/appeals/appeals" }], // "Either Not started, Ongoing or Passed"
    ["Send Grades: ", { 'link': "/assignments/sendgrades/sendgrades"}]
  ];
}

// function incActiveStep(activeStep){
//   if (activeStep == 8){
//     return 0
//   }
//   else{
//     return activeStep + 1
//   }
// }
function assignmentchecklist(props) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [peerReviews, setPeerReviews] = React.useState(true); // true if peer reviews are enabled
  const [rubric, setRubric] = React.useState(''); // state for the rubric
  // const [dueDate, setDueDate] = React.useState(Date.now()); // original assignment due date
  const [prDueDate, setPrDueDate] = React.useState(); // PR assignment due date
  const [dueDate, setDueDate] = React.useState(props.dueDate);
  let assignmentId = props.assignmentId; // id of currently selected assignment
  let assignmentName = props.assignmentName;
  let rubricId = props.rubricId;
  const steps = getSteps();


  useEffect(() => {
    if (!assignmentId)
      return;
    axios.get(`/api/assignments/${assignmentId}`).then(res => {
      const assignmentData = res.data.data;
      console.log('checklist assignment data:',assignmentData);
      if (!assignmentData) {
        return;
      }

      setDueDate(assignmentData.assignmentDueDate);
      setPrDueDate(assignmentData.reviewDueDate);

      let reviewStatus = assignmentData.reviewStatus;
      let today = new Date();
      switch(reviewStatus) {
        case 1:
          let dueDate = new Date(assignmentData.assignmentDueDate);
          if (today < dueDate) {  // dueDate not yet passed
            setActiveStep(1);
          } else {                // dueDate passed
            setActiveStep(2);
            axios.patch(`/api/assignments/${assignmentId}`, {reviewStatus: 2})
          }
          break;
        case 3:
          let reviewDueDate = new Date(assignmentData.reviewDueDate);
          if (today < reviewDueDate) {  // reviewDueDate not yet passed
            setActiveStep(3);
            console.log("not yet passed")
          } else {                // reviewDueDate passed
            setActiveStep(4);
            axios.patch(`/api/assignments/${assignmentId}`, {reviewStatus: 4})
          }
        default:
          setActiveStep(reviewStatus);
          break;
      }
    })
  }, []);

  if (!assignmentId) {
    console.log("no assignmentId");
    return null;
  }

  return (
    <div className={classes.root}>
      <div className={styles.header}>Assignment Checklist</div>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label) => {

          // only for enabling and disabling peer reviews
          if (label[1].switch) {
            return (
              <Step key={label[0]}>
                <StepLabel>
                  {label[0]}
                  <Switch color="primary" checked={peerReviews ? true : false} onChange={() => setPeerReviews(!peerReviews)} />
                </StepLabel>
              </Step>)
          }
          // only for picking dates
          if (label[1].date) {
            return (
              <Step key={label[0]}>
                <StepLabel>
                  {/* TO DO : CHANGE INLINE STYLING */}
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <div style={{ marginRight: '10px' }}>{label[0]}</div>
                    {formatTimestamp(label[0] == "Assignment Due Date: " ? dueDate : prDueDate)}
                  </div>
                </StepLabel>

              </Step>)
          }
          if (label[1].status) {
            return (
              <Step key={label[0]}>
                <StepLabel>{label[0] + label[1].status}</StepLabel>
              </Step>)
          }
          else {
            return (
              <Step key={label[0]}>
                <StepLabel>{label[0]}
                <Link href={{ pathname: label[1].link, query: { assignmentId: assignmentId, assignmentName: assignmentName, rubricId: rubricId, dueDate: dueDate } }}>
                  Edit
                </Link>
                  {/* <Link href={label[1].link} assignmentId={assignmentId} assignmentName={assignmentName}>Edit</Link> */}
                </StepLabel>
              </Step>)
          }
        })}
      </Stepper>
      {/* <Button variant="contained" color="primary" style={{marginLeft: '20px'}} onClick={()=>setActiveStep(incActiveStep(activeStep))}>
        Next Step
      </Button> */}
    </div>
  );
}

export default assignmentchecklist;
