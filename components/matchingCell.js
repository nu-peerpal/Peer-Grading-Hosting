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
  const [prProgress, setPrProgress] = useState({});
  const [numPeers, setNumPeers] = useState();
  const [formattedTAs, setFormattedTAs] = useState('');
  const [formattedTAsNotCompleted, setFormattedTAsNotCompleted] = useState('');
  const [formattedPeersCompleted, setFormattedPeersCompleted] = useState('');
  const [formattedPeersNotCompleted, setFormattedPeersNotCompleted] = useState('');
  const [formattedSubs, setFormattedSubs] = useState('');
  console.log('props:',props)

  // for (var j = 0; j < notCompletedSubmissionIds.length; j++)
            //  if subMap[notCompletedSubmissionIds[j]].includes(props.submission) {
            //      if (props.peers[i]["id"] == notCompletedUserIds[j])
            //          formattedPeersNotCompleted += props.peers[i]["name"]
            // }

  // for (var j = 0; j < notCompletedSubmissionIds.length; j++) {
  //   if (subMap[notCompletedSubmissionIds[j]].includes(props.submission)) {
  //     if (props.peers[i]["id"] == notCompletedUserIds[j]) {
  //       formattedPeersNotCompleted += props.peers[i]["name"]
  //     }
  //   }
  // }

  useEffect(() => {
    var formattedPeers = "";
    var formattedTAs = "";
    var formattedTAsNotCompleted = "";
    var formattedPeersCompleted = "";
    var formattedPeersNotCompleted = "";

    // need to import this variable from reloadMatchings.js and convert it to string form
    var newCompletedArray = props.completedReviewers;

    var prProgress = props.prProgress
    var subMap = props.submissionMap

    console.log('subMap:',subMap);
  

    let numPeers;
    // console.log(props);
    if (props.peers){
      numPeers = props.peers.length;
      // for (var i = 0; i < numPeers; i++) {
      //   formattedPeers += (props.peers[i]["name"]);
      //   formattedPeers += (", ")
      // }

      // var indexArray = [];

      // for (var j = 0; j < completedSubmissionIds.length; j++) {
      //   if (subMap[completedSubmissionIds[j]].includes(props.submission)) {
      //     indexArray.push(String(j));
      //   }
      // }
      // console.log('indexArray:',indexArray);

      // for (var i = 0; i < numPeers; i++) {
      //   for (var element in indexArray) {
      //     if (props.peers[i]["id"].includes(completedUserIds[element])) {
      //       console.log('completedUserIds[element]:',completedUserIds[element])
      //       formattedPeersCompleted += (props.peers[i]["name"]);
      //       formattedPeersCompleted += (", ");
      //     }
      //   }
      // }


      props.peers.forEach(peer => {
        if (prProgress[props.submissionId] && prProgress[props.submissionId].completedReviewers.includes(parseInt(peer.id))) {
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

      // color coding TAs and completed/not completed

      // for (var i = 0; i < numPeers; i++) {
      //   if (newCompletedArray.includes(props.peers[i]["id"]) && props.peers[i]["name"].includes("TA")) {
      //     formattedTAs += (props.peers[i]["name"])
      //     formattedTAs += (", ")
      //   } else if (!newCompletedArray.includes(props.peers[i]["id"]) && props.peers[i]["name"].includes("TA")) {
      //       formattedTAsNotCompleted += (props.peers[i]["name"]);
      //       formattedTAsNotCompleted += (", ")
      //   } else if (newCompletedArray.includes(props.peers[i]["id"]) && !props.peers[i]["name"].includes("TA")) {
      //       formattedPeersCompleted += (props.peers[i]["name"]);
      //       formattedPeersCompleted += (", "); 
      //   } else if (!newCompletedArray.includes(props.peers[i]["id"]) && !props.peers[i]["name"].includes("TA")) {
      //       formattedPeersNotCompleted += (props.peers[i]["name"]);
      //       formattedPeersNotCompleted += (", "); 
      //   }
      // }

      // for (var i = 0; i < numPeers; i++) {
      //   for (var j = 0; j < completedSubmissionIds.length; j++) {
      //     if (subMap[completedSubmissionIds[j]].includes(props.submission)) {
      //       if (props.peers[i]["id"] == completedUserIds[j]) {
      //         formattedPeersCompleted += props.peers[i]["name"]
      //       }
      //     }
      //   }
      // }

    }

    var formattedSubs = "";
    let numSubs;
    if (props.submissions){
      numSubs = props.submissions.length;
      for (var i = 0; i < numSubs; i++) {
        formattedSubs += (JSON.stringify(props.submissions[i]));
        formattedSubs += (", ")
      }
    }
    setNumPeers(numPeers);
    setFormattedTAs(formattedTAs);
    setFormattedTAsNotCompleted(formattedTAsNotCompleted);
    setFormattedPeersCompleted(formattedPeersCompleted);
    setFormattedPeersNotCompleted(formattedPeersNotCompleted);
    setFormattedSubs(formattedSubs);
  }, [])

    // console.log(props);
      
      // color coding TAs only

      // for (var i = 0; i < numPeers; i++) {
      //   if (props.peers[i]["name"].includes("TA")) {
      //     formattedTAs += (props.peers[i]["name"])
      //     formattedTAs += (", ")
      //   } else {
      //     formattedPeers += (props.peers[i]["name"]);
      //     formattedPeers += (", ")
      //   }
      // }

  
    // var formattedSubs = "";
    // let numSubs;
    // if (props.submissions){
    //   numSubs = props.submissions.length;
    //   for (var i = 0; i < numSubs; i++) {
    //     formattedSubs += (JSON.stringify(props.submissions[i]));
    //     formattedSubs += (", ")
    //   }
    // }
  
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
    else{
      return (
        <div className={styles.matchingCell}>
          <div>
            <p className={styles.matchingCell__title}><b>Reviewer:</b></p>
            <p className={styles.matchingCell__value}>{props.reviewer}</p>
          </div>
          <div>
            <p className={styles.matchingCell__title}><b>({numSubs}) Submissions:</b></p>
            <p className={styles.matchingCell__value}>{formattedSubs.slice(0,-2)}</p>
          </div>
        </div>
      );
    }
  
  }

  // Progress bar 

let MIN = 0
let MAX = 6
// Function to normalise the values (MIN / MAX could be integrated)
const normalise = value => (value - MIN) * 100 / (MAX - MIN);

function LinearProgressWithLabel(props) {
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

  React.useEffect(() => {
      setProgress(props.progress[0])
  }, []);

  return (
    <div className={classes.root}>
      <LinearProgressWithLabel value={progress} />
    </div>
  );
}

// LinearProgressWithLabel(LinearProgressWithLabel.propTypes);
// LinearWithValueLabel();

// End of progress bar

export default MatchingCell;