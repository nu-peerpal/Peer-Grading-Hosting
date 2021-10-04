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
import ReloadMatchings from "../../../components/reloadMatchings";


function Matching(props) {
  const [matchings, setMatchings] = useState([]);
  const [matchingGrid, setMatchingGrid] = useState([]);
  const [matchingExists, setMatchingExists] = useState(false);
  const [peerReviews, setPeerReviews] = useState([]);
  const [submissionData, setSubmissionData] = useState();
  const [subStudentIds, setSubStudentIds] = useState();
  const [grader, setGrader] = useState();
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState("");
  const [userList, setUserList] = useState([]);
  const router = useRouter()
  let {assignmentId, assignmentName} = router.query;

  useEffect(() => {
    axios.get(`/api/peerReviews?assignmentId=${assignmentId}`).then(prData => {
      let peerReviewData = prData.data.data;
      if (peerReviewData.length > 0) {
        setMatchingExists(true);
        setPeerReviews(peerReviewData)
      }
    })
  }, [])

  async function handleSubmit() {
    setMatchingExists(true);
    let usersData = userList.map(user => {
      return {
        id: user.canvasId,
        canvasId: user.canvasId,
        lastName: user.lastName,
        firstName: user.firstName,
        enrollment: user.enrollment,
        courseId: user.courseId
      }
    })
    let errs = [];
    console.log("adding users", usersData);

    await axios.post(`/api/users?type=multiple`, usersData).catch(error => {
      // console.log(error);
      console.log('Users already posted')
      // errs.push('Redundant users not posted.');
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
    // post group enrollments
    let group_enrollments = [];
    reduced_subs.forEach(submission => { // for each submission posted
      subStudentIds[submission.canvasId].forEach(userId => { // for each user with that submission
        group_enrollments.push({
          assignmentId: assignmentId,
          userId: userId,
          submissionId: submission.canvasId
        });
      });
    });
    console.log('adding group enrollments:', group_enrollments);
    await axios.post(`/api/groupEnrollments?type=multiple`, group_enrollments).catch(error => {
      console.log(error);
      errs.push('Group enrollments failed.');
    });

    // post peer matchings
    const peerMatchings = matchings.map(matching => {
      if (grader.includes(matching[0])) { // if grader matching
        return {
          matchingType: "TA",
          review: null,
          reviewReview: null,
          assignmentId: assignmentId,
          submissionId: matching[1],
          userId: matching[0]
        }
      } else { // student matching
        return {
          matchingType: "initial",
          review: null,
          reviewReview: null,
          assignmentId: assignmentId,
          submissionId: matching[1],
          userId: matching[0]
        }
      }
    })
    console.log("POST peer matchings", peerMatchings);
    await axios.post(`/api/peerReviews?type=multiple`, peerMatchings)
    .then(res => console.log("res", res))
    .catch(err => {
      console.log(err);
      errs.push('Peer Matchings not posted');
    });
    if (errs.length == 0) {
      setErrors("Submitted Successfully.")
      axios.patch(`/api/assignments/${assignmentId}`, {reviewStatus: 3});
    } else {
      setErrors(String(errs));
    }

    // Notify students when they have new PeerPal tasks

    Promise.all(userList.map(user => {
      return axios.post(`/api/sendemail?type=studentNotification&courseId=${courseId}`, {
        userId: user.canvasId,
        subject: 'Assigned Peer Reviews',
        message: `New peer reviews have been assigned on PeerPal.`
      })
    }))

  }

  return (
    <div className="Content">
      <Container name={"Peer Matching: " + assignmentName}>
      {matchingExists ? <Accordion defaultExpanded={true} className={styles.matching}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Existing Matching
          </AccordionSummary>
          <AccordionDetails>
             <ReloadMatchings matchings={peerReviews} setMatchingGrid={setMatchingGrid} />
          </AccordionDetails>
        </Accordion>
        : // PUT PROGRESS BAR HERE
        <Accordion defaultExpanded={true} className={styles.matching}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Settings
          </AccordionSummary>
          <AccordionDetails>
             <Settings
              // graders={graders}
              // peers={peers}
              setSubmissionData={setSubmissionData}
              setSubStudentIds={setSubStudentIds}
              setGrader={setGrader}
              setMatchings={setMatchings}
              setMatchingGrid={setMatchingGrid}
              setSubmitted={setSubmitted}
              setUserList={setUserList}
            />
          </AccordionDetails>
        </Accordion>
        }
        <div className={styles.matchingGrid}>
          {matchingGrid}
        </div>
      </Container>
      {submitted && <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }} >
        <Button disabled={matchingExists} onClick={handleSubmit}>
          Confirm Matchings
        </Button>
        {errors}
      </div>}
      <StudentViewOutline isStudent={props.ISstudent} SetIsStudent={props.SetIsStudent} />
    </div>
  );
}

export default Matching;
