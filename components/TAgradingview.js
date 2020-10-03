import React, { useState } from "react";
import styles from "./styles/submissionview.module.css";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import PeerReviewMatrix from "./UI/PeerReviewMatrix";

const peerMatchings = [
  {
    user_id: 1,
    review: [
      {
        points: 9,
        maxPoints: 10,
        element: "Answer/Algorithm",
        comment: "Great algorithm!",
      },
      {
        points: 8,
        maxPoints: 10,
        element: "Proof Analysis",
        comment: "Proof could be better...",
      },
      {
        points: 8.5,
        maxPoints: 10,
        element: "Clarity",
        comment: "Fairly clear",
      },
    ],
    lastName: "Ramos",
    firstName: "Bradley",
  },
  {
    user_id: 2,
    review: [
      {
        points: 7,
        maxPoints: 10,
        element: "Answer/Algorithm",
        comment: "Doesn't make sense.",
      },
      {
        points: 7.5,
        maxPoints: 10,
        element: "Proof Analysis",
        comment: "Unclear analysis",
      },
      {
        points: 9.5,
        maxPoints: 10,
        element: "Clarity",
        comment: "Good clarity overall",
      },
    ],
    lastName: "Chung",
    firstName: "Andrew",
  },
  {
    user_id: 3,
    review: [
      {
        points: 10,
        maxPoints: 10,
        element: "Answer/Algorithm",
        comment: "Algorithm is efficient",
      },
      {
        points: 8.5,
        maxPoints: 10,
        element: "Proof Analysis",
        comment: "Ok proof analysis",
      },
      {
        points: 8,
        maxPoints: 10,
        element: "Clarity",
        comment: "Could be little clearer",
      },
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
  const [upvotesAveraged, setUpvotesAveraged] = useState(false);

  return (
    <div className={styles.sub}>
      <FormControlLabel
        checked={upvotesAveraged}
        onChange={(e) => setUpvotesAveraged(e.target.checked)}
        control={<Switch color='primary' />}
        label='Average upvotes to instructor grade'
        labelPlacement='start'
      />
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
        upvotesAveraged={upvotesAveraged}
      />
    </div>
  );
};

export default TAsubmission;
