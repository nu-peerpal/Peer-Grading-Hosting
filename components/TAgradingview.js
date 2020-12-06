import React from "react";
import styles from "./styles/tagrading.module.css";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PeerReviewMatrix from "./UI/PeerReviewMatrix";

const TAsubmission = ({ assignmentRubric, reviewRubric, peerMatchings }) => {
  return (
    <div className={styles.sub}>
      <Accordion className={styles.acc}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          User 1's submission
        </AccordionSummary>
        <AccordionDetails>Should display assignment PDF...</AccordionDetails>
      </Accordion>
      <PeerReviewMatrix
        assignmentRubric={assignmentRubric}
        reviewRubric={reviewRubric}
        peerMatchings={peerMatchings}
      />
    </div>
  );
};

export default TAsubmission;
