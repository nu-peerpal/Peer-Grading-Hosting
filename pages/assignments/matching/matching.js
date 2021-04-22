import React, { useState, useEffect } from "react";
import styles from "./matching.module.scss";
import Container from "../../../components/container";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from "@material-ui/core/Button";
import Settings from "../../../components/settings";
import { useUserData } from "../../../components/storeAPI";
import { useRouter } from 'next/router';
const axios = require("axios");
import StudentViewOutline from '../../../components/studentViewOutline';


function Matching(props) {
  const [matchings, setMatchings] = useState([]);
  const [matchingGrid, setMatchingGrid] = useState([]);
  const [submissionData, setSubmissionData] = useState();
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState("");
  const [userList, setUserList] = useState([]);
  const router = useRouter()
  let {assignmentId, assignmentName} = router.query;


  async function handleSubmit() {
    let usersData = userList.map(user => {
      return {
        id: user.canvasId,
        canvasId: user.canvasId,
        lastName: user.lastName,
        firstName: user.firstName
      }
    })
    let errs = [];
    console.log("adding users", usersData);

    await axios.post(`/api/users?type=multiple`, usersData).catch(error => {
      console.log(error);
      errs.push('Redundant users not posted.');
    });
    // remove duplicate submission data
    function contains(a, id) {
      var i = a.length;
      while (i--) {
         if (a[i].canvasId === id) {
             return true;
         }
      }
      return false;
    }
    let reduced_subs = []
    submissionData.forEach(submission => {
        if (!contains(reduced_subs,submission.canvasId)) {
            reduced_subs.push(submission);
        }
    });
    console.log('adding submissions:',reduced_subs);
    // post submissions
    await axios.post(`/api/uploadSubmissions?type=multiple`, reduced_subs).catch(error => {
      console.log(error);
      errs.push('New Submissions not posted.');
    });

    // post peer matchings
    const peerMatchings = matchings.map(matching => {
      return {
        matchingType: "initial",
        review: null,
        reviewReview: null,
        assignmentId: assignmentId,
        submissionId: matching[1],
        userId: matching[0]
      }
    })
    console.log("POST peer matchings", peerMatchings);
    await axios.post(`/api/peerReviews?type=multiple`, peerMatchings)
    .then(res => console.log("res", res))
    .catch(err => {
      console.log(err);
      errs.push('Peer Matchings not posted');
    });
    setErrors(String(errs));
  }

  return (
    <div className="Content">
      <Container name={"Peer Matching: " + router.query.assignmentName}>
        <Accordion className={styles.matching}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Settings
          </AccordionSummary>
          <AccordionDetails>
            <Settings
              // graders={graders}
              // peers={peers}
              setSubmissionData={setSubmissionData}
              setMatchings={setMatchings}
              setMatchingGrid={setMatchingGrid}
              setSubmitted={setSubmitted}
              setUserList={setUserList}
            />
          </AccordionDetails>
        </Accordion>
        <div className={styles.matchingGrid}>
          {matchingGrid}
        </div>
      </Container>
      {submitted && <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }} >
        <Button onClick={handleSubmit}>
          Confirm Matchings
        </Button>
        {errors}
      </div>}
      <StudentViewOutline isStudent={props.ISstudent} SetIsStudent={props.SetIsStudent} />
    </div>
  );
}

export default Matching;
