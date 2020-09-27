import React from "react";
import styles from "./styles/submissionview.module.css";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PeerReviewMatrix from "./UI/PeerReviewMatrix";

const peerMatchings = [
  {
    user_id: 1,
    review: [
      { points: 9, maxPoints: 10, element: "Answer/Algorithm" },
      { points: 8, maxPoints: 10, element: "Proof Analysis" },
      { points: 8.5, maxPoints: 10, element: "Clarity" },
    ],
    lastName: "Ramos",
    firstName: "Bradley",
  },
  {
    user_id: 2,
    review: [
      { points: 7, maxPoints: 10, element: "Answer/Algorithm" },
      { points: 7.5, maxPoints: 10, element: "Proof Analysis" },
      { points: 9.5, maxPoints: 10, element: "Clarity" },
    ],
    lastName: "Chung",
    firstName: "Andrew",
  },
  {
    user_id: 3,
    review: [
      { points: 10, maxPoints: 10, element: "Answer/Algorithm" },
      { points: 8.5, maxPoints: 10, element: "Proof Analysis" },
      { points: 8, maxPoints: 10, element: "Clarity" },
    ],
    lastName: "Liu",
    firstName: "Jonathan",
  },
];

const assignmentRubric = [
  { maxPoints: 10, element: "Answer/Algorithm" },
  { maxPoints: 10, element: "Proof Analysis" },
  { maxPoints: 10, element: "Clarity" },
];

const reviewRubric = [
  { maxPoints: 10, element: "Quantitative" },
  { maxPoints: 10, element: "Qualitative" },
];

const TAsubmission = () => {
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
