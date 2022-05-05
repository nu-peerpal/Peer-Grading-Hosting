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
import SubmitButton from '../../../components/submitButton';


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
  const [submitSuccess, setSubmitSuccess] = useState(true);
  const [anyChanges, setAnyChanges] = useState("disable");

  function formatTimestamp(timestamp) {
    var d = new Date(timestamp);
    return ((d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes()+ ':59');

  }

  
  function toDate(timestamp) {
    var d = new Date(timestamp);
    var currentMonth = d.getMonth() + 1;
    if (currentMonth < 10) {
      currentMonth = '0' + currentMonth;
    }
    var currentDay = d.getDate();
    if (currentDay < 10) {
      currentDay = '0' + currentDay;
    }
    var currentHour = d.getHours();
    if (currentHour < 10) {
      currentHour = '0' + currentHour;
    }
    var currentMinute = d.getMinutes();
    if (currentMinute < 10) {
      currentMinute = '0' + currentMinute;
    }

    var date = (d.getFullYear() + '-' + currentMonth + '-' + currentDay + 'T' + currentHour + ':' + currentMinute + ':59');
    console.log('toDate date:', date);
    return date;
  }

  useEffect(() => {
    Promise.all([
      axios.get(`/api/assignments/${assignmentId}`),
      axios.get(`/api/peerReviews?assignmentId=${assignmentId}&matchingType=appeal`),
      axios.get(`/api/courses/${courseId}`)
    ]).then(data => {
      let assignmentData = data[0].data.data
      console.log('assignmentData:',assignmentData)
      let peerReviewData = data[1].data.data
      let courseSettings = data[2].data.data
      console.log("settings", courseSettings)
      let appealToPrTimeDelta = Number(courseSettings.appealToPrTimeDelta);
      let appealDueDate = new Date(assignmentData.reviewDueDate);
      appealDueDate = new Date(appealDueDate.getTime() + appealToPrTimeDelta);
      appealDueDate = toDate(appealDueDate)
      let appealDateString = appealDueDate.toString();
      console.log("appeal date", appealDateString)
      setPeerReviews(peerReviewData);
      if (assignmentData.reviewDueDate) {
        let formattedDate = formatTimestamp(assignmentData.reviewDueDate);
        setLoadedDeadline(formattedDate);
        setExistingDueDate(true);
      }
    })
  }, []);

  async function handleSubmit() {
    // console.log({appealDueDae})
    axios.patch(`/api/assignments/${assignmentId}`,{ appealsDueDate: appealDueDate }).then(res => {
      if (res.status == 201) {
        setSubmitResponse("Deadline set.")
        setExistingDueDate(true);
        setSubmitSuccess(true);
        setAnyChanges("disable");
      }
    }).catch(err => {
      setSubmitResponse("Something went wrong.")
      setSubmitSuccess(false);
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
                    value={appealDateString}
                    onChange={e => {
                      setAppealDueDate(e.target.value+":59-05:00") // hardcode CT, might have to change with time shift
                      setAnyChanges("")}}
                    InputLabelProps={{
                    shrink: true,
                    }}
                  />
              </form>
              <SubmitButton onClick={handleSubmit} 
                title={existingDueDate ? "Update Deadline" : "Set Deadline"} 
                anyChanges={anyChanges}
                submitAlert={submitResponse}
                submitSuccess={submitSuccess}/>
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