import React from 'react';
import styles from "../pages/assignments/matching/matching.module.scss";

// display submission and peers reviewing it
function MatchingCell(props) {
  
    // nicely format the list of peers reviewing the submissions
    var formattedPeers = "";
    let numPeers;
    if (props.peers){
      numPeers = props.peers.length;
      for (var i = 0; i < numPeers; i++) {
        formattedPeers += (props.peers[i]["name"]);
        formattedPeers += (", ")
      }
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
  
     if (!props.reviewer){
      return (
        <div className={styles.matchingCell}>
          <div>
            <p className={styles.matchingCell__title}><b>Submission:</b></p>
            <p className={styles.matchingCell__value}>{props.submission}</p>
          </div>
          <div>
            <p className={styles.matchingCell__title}><b>({numPeers}) Reviewers:</b></p>
            <p className={styles.matchingCell__value}>{formattedPeers.slice(0, -2)}</p>
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

export default MatchingCell;