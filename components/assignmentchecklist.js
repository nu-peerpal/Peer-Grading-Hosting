import React from "react";
import Link from 'next/link'
import styles from './styles/assignmentchecklist.module.css'
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";

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
    ["Peer Reviews: ", {'status': "Disabled or Enabled"}],    
    ["Due Date: ", {'status': "status"}], 
    ["Peer Matching: ", { 'link': "/assignments/matching" }], 
    ["Review Due Date: ", {'status': "status"}], 
    ["Additional Matches: ", { 'link': "/assignments/checkmatching" }], 
    ["TA Grading: ", { 'link': "/assignments/tamatchinglist" }], 
    ["Review Reports: ", { 'link': "/assignments/reviewreportlist" }], 
    ["Submission Reports: ", { 'link': "/assignments/submissionreportlist" }], 
    ["Appeal Period: ", {'status': "Either Not started, Ongoing or Passed"}]
  ];
}

function assignmentchecklist() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(2);
  const steps = getSteps();

  return (
    <div className={classes.root}>
      <div className={styles.header}>Assignment Checklist</div>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label) => {
          if (label[1].status) {
            return(
            <Step key={label[0]}>
              <StepLabel>{label[0] + label[1].status}</StepLabel>
            </Step>)
          }
          else{
            return(
            <Step key={label[0]}>
              <StepLabel>{label[0]} 
              <Link href={label[1].link}>View</Link>
              </StepLabel>
            </Step>)
          }
        })}
      </Stepper>
    </div>
  );
}

// class assignmentchecklist extends React.Component {
// constructor(props) {
//   super(props);
//   this.state = {
//     // :[
//     //   {'name': '', 'info':""},
//     //   {'name': '', 'info':""},
//     // ],
//   }
// }

// render() {
//   //   const = this.state
//   return (
//     <div>
//       <div className={styles.header}>Assignment Checklist</div>
//       <div>Peer Reviews: </div>{/*Says disabled or enabled*/}
//       <div>Due Date: </div>{/*Fill in*/}
//       <div>Peer Matching: <Link href={"/assignments/matching"}>View</Link>
//       </div>
//       <div>Review Due Date: </div>{/*Fill in*/}
//       <div>Additional Matches: <Link href={"/assignments/checkmatching"}>View</Link>
//       </div>
//       <div>TA Grading: </div>{/*Will just be a list of submissions that shows if they have been graded or not*/}
//       <div>Review Reports: <Link href={""}>View</Link></div>
//       <div>Submission Reports: <Link href={""}>View</Link></div>
//       <div>Appeal Period: </div>{/*Either Not started, Ongoing or Passed*/}
//     </div>
//   )
// }
// }

export default assignmentchecklist;