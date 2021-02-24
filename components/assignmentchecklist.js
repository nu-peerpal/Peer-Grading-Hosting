import React from "react";
import Link from 'next/link'
import styles from './styles/assignmentchecklist.module.scss'
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';


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



function getSteps() {
  return [
    ["Assignment Due Date: ", { 'date': "status" }],
    ["Peer Reviews: ", { 'switch': 'enabled or disabled' }],
    ["Rubric: ", { 'rubric': "status" }],
    ["Peer Matching: ", { 'link': "/assignments/matching/matching" }],
    ["Review Due Date: ", { 'date': "status" }],
    ["Additional Matches: ", { 'link': "/assignments/checkmatching" }],
    ["TA Grading: ", { 'link': "/assignments/tamatchinglist/tamatchinglist" }],
    ["Review and Submission Reports: ", { 'link': "/assignments/reportlist/reportlist" }],
    // ["Submission Reports: ", { 'link': "/assignments/submissionreportlist/submissionreportlist" }],
    ["Appeal Period: ", { 'status': "Either Not started, Ongoing or Passed" }]
  ];
}


function assignmentchecklist() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(2);
  const [peerReviews, setPeerReviews] = React.useState(true); // true if peer reviews are enabled
  const [rubric, setRubric] = React.useState('');
  const steps = getSteps();

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
                  <Switch color="primary" checked={peerReviews ? true : false} onChange={()=>setPeerReviews(!peerReviews)}/>
                </StepLabel>
              </Step>)
          }
          // only for selecting rubrics
          if (label[1].rubric) {
            return (
              <Step key={label[0]}>
                <StepLabel>
                <div style={{marginRight: '10px'}}>{label[0]}
                  <Select
                    id="simple-select"
                    value={rubric}
                    onChange={setRubric}
                  >
                    <MenuItem value={10}>(Default)</MenuItem>
                    <MenuItem value={20}>Custom 1</MenuItem>
                    <MenuItem value={30}>Custom 2</MenuItem>
                  </Select>
                  </div>
                </StepLabel>
              </Step>)
          }
          // only for picking dates
          if (label[1].date) {
            return (
              <Step key={label[0]}>
                <StepLabel>
                  {/* TO DO : CHANGE INLINE STYLING */}
                  <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                  <div style={{marginRight: '10px'}}>{label[0]}</div>
                  <form className={classes.container} noValidate>
                    <TextField
                      id="datetime-local"
                      type="datetime-local"
                      defaultValue={"2021-05-24T11:59"}
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled={peerReviews ? false : true}
                    />
                  </form>
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
                  <Link href={label[1].link}>Edit</Link>
                </StepLabel>
              </Step>)
          }
        })}
      </Stepper>
    </div>
  );
}

export default assignmentchecklist;