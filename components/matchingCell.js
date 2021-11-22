import React, { useState, useEffect } from 'react';
import styles from "../pages/assignments/matching/matching.module.scss";
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
// import ReloadMatchings from "../../../components/reloadMatchings";

// display submission and peers reviewing it
function MatchingCell(props) {
  const [numPeers, setNumPeers] = useState();
  const [numSubs, setNumSubs] = useState();
  const [formattedTAs, setFormattedTAs] = useState('');
  const [formattedTAsNotCompleted, setFormattedTAsNotCompleted] = useState('');
  const [formattedPeersCompleted, setFormattedPeersCompleted] = useState('');
  const [formattedPeersNotCompleted, setFormattedPeersNotCompleted] = useState('');
  const [formattedSubs, setFormattedSubs] = useState('');

  useEffect(() => {
    var formattedPeers = "";
    var formattedTAs = "";
    var formattedTAsNotCompleted = "";
    var formattedPeersCompleted = "";
    var formattedPeersNotCompleted = "";
    var prProgress = props.prProgress
    var userProgress = props.userProgress
    let numPeers;
    // console.log(props);

    var formattedSubs = "";
    let numSubs;
    if (props.submissions){
      numSubs = props.submissions.length;
      formattedSubs += props.submissions.map(s => JSON.stringify(s)).join(", ");
    }

    if (props.peers){
      numPeers = props.peers.length;
      // console.log('peers', props.peers)
      props.peers.forEach(peer => {
        if (prProgress && (prProgress[props.submissionId] && prProgress[props.submissionId].completedReviewers.includes(parseInt(peer.id)))) {
          if (peer["name"].includes("TA")) {
            formattedTAs += peer["name"];
            formattedTAs += (", ");
          } else {
            formattedPeersCompleted += peer["name"];
            formattedPeersCompleted += (", ");
          }
        }
         else {
          formattedPeersNotCompleted += peer["name"];
          formattedPeersNotCompleted += (", ");
        }
      })

    } else {
        // do logic for listing out completed submissions
          props.submissions.forEach(submission => {
            if (userProgress && (userProgress[props.reviewerId] && userProgress[props.reviewerId].completedSubmissions.includes(submission.id))) {
                  formattedPeersCompleted += (JSON.stringify(submission.submission));
                  formattedPeersCompleted += (", ");
                } else {
                  formattedPeersNotCompleted += (JSON.stringify(submission.submission));
                  formattedPeersNotCompleted += (", ");
                }
              })
            }



    setNumPeers(numPeers);
    setNumSubs(numSubs);
    setFormattedTAs(formattedTAs);
    setFormattedTAsNotCompleted(formattedTAsNotCompleted);
    setFormattedPeersCompleted(formattedPeersCompleted);
    setFormattedPeersNotCompleted(formattedPeersNotCompleted);
    setFormattedSubs(formattedSubs);
  }, [])

     if (!props.reviewer){
      return (
        <div className={styles.matchingCell}>
          <div>
            <p className={styles.matchingCell__title}><b>Submission:</b></p>
            <p className={styles.matchingCell__value}>{props.submission}</p>
          </div>
          <div>
            <p className={styles.matchingCell__title}><b>({numPeers}) Reviewers:</b></p>
            {/* <p className={styles.matchingCell__value}>{formattedPeers.slice(0, -2)}</p> */}
            <p className={styles.matchingCell__taValue}>{formattedTAs.slice(0, -2)}</p>
            <p className={styles.matchingCell__notCompletedValue}>{formattedTAsNotCompleted.slice(0, -2)}</p>
            <p className={styles.matchingCell__completedValue}>{formattedPeersCompleted.slice(0, -2)}</p>
            <p className={styles.matchingCell__notCompletedValue}>{formattedPeersNotCompleted.slice(0, -2)}</p>
          </div>
          <div className={styles.matchingCell__progress}>
            <LinearWithValueLabel progress={props.progress} />
          </div>
        </div>
      );
    }
    else if (props.reviewer) {
      return (
        <div className={styles.matchingCell}>
          <div>
            <p className={styles.matchingCell__title}><b>Reviewer:</b></p>
            <p className={styles.matchingCell__value}>{props.reviewer}</p>
          </div>
          <div>
            <p className={styles.matchingCell__title}><b>({numSubs}) Submissions:</b></p>
            {/* <p className={styles.matchingCell__value}>{formattedSubs.slice(0,-2)}</p> */}
            <p className={styles.matchingCell__completedValue}>{formattedPeersCompleted.slice(0, -2)}</p>
            <p className={styles.matchingCell__notCompletedValue}>{formattedPeersNotCompleted.slice(0, -2)}</p>
          </div>
          <div className={styles.matchingCell__progress}>
            <LinearWithValueLabelCaseTwo progressCaseTwo={props.progressCaseTwo} />
          </div>
        </div>
      );
    }

  }

  // Progress bar

function LinearProgressWithLabel(props) {
  let MIN = 0;
  let MAX = props.maximumValue;
  // Function to normalise the values (MIN / MAX could be integrated)
  const normalise = value => (value - MIN) * 100 / (MAX - MIN);
  return (
    <Box display="flex" alignItems="center" flexDirection="column">
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value,
        )}`}</Typography>
      </Box>
      <Box width="100%" mr={1}>
        {/* <LinearProgress variant="determinate" {...props} /> */}
        <LinearProgress variant="determinate" value={normalise(props.value)} />
      </Box>
    </Box>
  );
}

// LinearProgressWithLabel.propTypes = {
//   /**
//    * The value of the progress indicator for the determinate and buffer variants.
//    * Value between 0 and 100.
//    */
//   // value: PropTypes.number.isRequired,
//   value: prProgress[review.submissionId].completed
// };

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});

function LinearWithValueLabel(props) {
  const classes = useStyles();
  const [progress, setProgress] = React.useState(0);
  const [progressBarMax, setProgressBarMax] = React.useState(0);

  React.useEffect(() => {
    if (props.progress) {
      setProgress(props.progress[0])
      setProgressBarMax(props.progress[1])
    } else {
      setProgress(0)
      setProgressBarMax(1)
    }
  }, []);

  return (
    <div className={classes.root}>
      <LinearProgressWithLabel value={progress} maximumValue={progressBarMax} />
    </div>
  );
}

// LinearProgressWithLabel(LinearProgressWithLabel.propTypes);
// LinearWithValueLabel();

// End of progress bar


  // Progress bar case 2

    function LinearProgressWithLabelCaseTwo(props) {
      let caseTwoMIN = 0
      let caseTwoMAX = props.maximumValueCaseTwo
      // Function to normalise the values (MIN / MAX could be integrated)
      const normaliseCaseTwo = value => (value - caseTwoMIN) * 100 / (caseTwoMAX - caseTwoMIN);
      return (
        <Box display="flex" alignItems="center" flexDirection="column">
          <Box minWidth={35}>
            <Typography variant="body2" color="textSecondary">{`${Math.round(
              props.value,
            )}`}</Typography>
          </Box>
          <Box width="100%" mr={1}>
            {/* <LinearProgress variant="determinate" {...props} /> */}
            <LinearProgress variant="determinate" value={normaliseCaseTwo(props.value)} />
          </Box>
        </Box>
      );
    }

    // LinearProgressWithLabel.propTypes = {
    //   /**
    //    * The value of the progress indicator for the determinate and buffer variants.
    //    * Value between 0 and 100.
    //    */
    //   // value: PropTypes.number.isRequired,
    //   value: prProgress[review.submissionId].completed
    // };

    const useStylesCaseTwo = makeStyles({
      root: {
        width: '100%',
      },
    });

    function LinearWithValueLabelCaseTwo(props) {
      const classes = useStylesCaseTwo();
      const [progressTwo, setProgressTwo] = React.useState(0);
      const [progressBarTwoMaximum, setProgressBarTwoMaximum] = React.useState(0);

      React.useEffect(() => {
          setProgressTwo(props.progressCaseTwo[0])
          setProgressBarTwoMaximum(props.progressCaseTwo[1])
      }, []);

      return (
        <div className={classes.root}>
          <LinearProgressWithLabelCaseTwo value={progressTwo} maximumValueCaseTwo={progressBarTwoMaximum} />
        </div>
      );
    }



export default MatchingCell;
