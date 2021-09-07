import React, { useState, useEffect } from "react";
import styles from "./styles/tagrading.module.scss";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PeerReviewMatrix from "./UI/PeerReviewMatrix";
import Typography from '@material-ui/core/Typography';

const TAsubmission = (props) => {
  return (
    <div className={styles.sub}>
      {props.peerMatchings && props.submission && <div><Accordion defaultExpanded={true} className={styles.acc}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Group {props.submission.groupId}'s submission
        </AccordionSummary>
        <AccordionDetails>
        {props.isDocument ? <iframe style={{ width:"100%",height:"100%",minHeight:"80vh"}} src={props.submission.s3Link}></iframe> : <Typography>{props.submission.s3Link}</Typography>}
        </AccordionDetails>
      </Accordion>
      <PeerReviewMatrix
        assignmentRubric={props.assignmentRubric}
        reviewRubric={props.reviewRubric}
        peerMatchings={props.peerMatchings}
        presetComments={props.presetComments}
        setPresetComments={props.setPresetComments}
      /></div>}
    </div>
  );
};

export default TAsubmission;
