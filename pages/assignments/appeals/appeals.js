import React, { useState, useEffect } from "react";
import Container from "../../../components/container";
import styles from "./appeals.module.scss";
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useRouter } from 'next/router';
import { useUserData } from "../../../components/storeAPI";
import StudentViewOutline from '../../../components/studentViewOutline';
import ReloadMatchings from "../../../components/reloadMatchings";
const axios = require("axios");


function Appeals(props) {
  const { userId, courseId, courseName, assignment } = useUserData();
  const router = useRouter();
  const { assignmentId, assignmentName, rubricId } = router.query;
  const [appealDueDate, setAppealDueDate] = useState();
  const [loadedDeadline, setLoadedDeadline] = useState("");
  const [existingDueDate, setExistingDueDate] = useState(false);
  const [submitResponse, setSubmitResponse] = useState("");
  const [matchingGrid, setMatchingGrid] = useState([]);
  const [peerReviews, setPeerReviews] = useState([]);

  function formatTimestamp(timestamp) {
    var d = new Date(timestamp);
    return ((d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear());
  
  }
  useEffect(() => {
    Promise.all([
      axios.get(`/api/assignments/${assignmentId}`),
      axios.get(`/api/peerReviews?assignmentId=${assignmentId}&matchingType=appeal`)
    ]).then(data => {
      let assignmentData = data[0].data.data
      let peerReviewData = data[1].data.data
      setPeerReviews(peerReviewData);
      if (assignmentData.appealsDueDate) {
        let formattedDate = formatTimestamp(assignmentData.appealsDueDate);
        setLoadedDeadline(formattedDate);
        setExistingDueDate(true);
        console.log('got date:', formattedDate)
      }
    })
  }, []);

  async function handleSubmit() {
    // console.log({appealDueDate})
    axios.patch(`/api/assignments/${assignmentId}`,{ appealsDueDate: appealDueDate }).then(res => {
      if (res.status == 200) {
        setSubmitResponse("Deadline set.")
        setExistingDueDate(true);
      }
    }).catch(err => {
      setSubmitResponse("Something went wrong.")
    })
  }

  return (
    <div className="Content">
      <Container name={"Appeals for: " + assignmentName}>
        <div className={styles.desc}>
        <Accordion defaultExpanded={true} className={styles.matching}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            {existingDueDate ? "Current Appeal Deadline: " + loadedDeadline : "Set Appeal Deadline for Students:"}
          </AccordionSummary>
          <AccordionDetails>
            <div className={styles.formfield}>
              <form noValidate>
                  <TextField className={styles.submitButton}
                    name="appealDueDate"
                    id="datetime-local"
                    type="datetime-local"
                    onChange={e => setAppealDueDate(e.target.value+":59-05:00")} // hardcode CT, might have to change with time shift
                    InputLabelProps={{
                    shrink: true,
                    }}
                  />
              </form>
              <Button onClick={handleSubmit}>{existingDueDate ? "Update Deadline" : "Set Deadline"}</Button>
              {submitResponse}
            </div>
          </AccordionDetails>
        </Accordion>
        <ReloadMatchings matchings={peerReviews} setMatchingGrid={setMatchingGrid} />
        <div className={styles.matchingGrid}>
          {matchingGrid}
        </div>
        </div>
      </Container>
      <StudentViewOutline isStudent={props.ISstudent} SetIsStudent={props.SetIsStudent} />
    </div>

  );

}

export default Appeals;
