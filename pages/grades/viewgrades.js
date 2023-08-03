import React, { useState, useEffect } from "react";
import Container from "../../components/container";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from "@material-ui/core/Button";
import styles from './grades.module.scss';
import StudentViewOutline from '../../components/studentViewOutline';
import ToggleAppeal from './toggleAppeal';
import { useUserData } from "../../components/storeAPI";
import { useRouter } from 'next/router';
import ReviewDisplayTableReadOnly from "../../components/UI/ReviewDisplayTableReadOnly";
const ReactMarkdown = require('react-markdown');
const gfm = require('remark-gfm')
const axios = require("axios");
const _ = require("lodash");

import {transformRubric, transformMatchings} from "../grading/tagrading";
import {formatRoot} from "../../components/apiCallUtils";

function ViewAssignmentGrade(props) {
    const router = useRouter();
    const { userId, courseId } = useUserData();

    const [submissions, setSubmissions] = useState(null);
    const [peerReviews, setPeerReviews] = useState(null);
    const [taReviews, setTaReviews] = useState(null);
    const [appeal, setAppeal] = useState(null);
    const [rubric, setRubric] = useState(null);

    const [loadSRSubmission, setLoadSRSubmission] = useState();
    const [loadRRSubmission, setLoadRRSubmission] = useState();
    const [eligibleAppeal, setEligibleAppeal] = useState();
    const [appealReview, setAppealReview] = useState({});
    const [appealAvailable, setAppealAvailable] = useState(false);
    const [appealButtonText, setAppealButtonText] = useState("Appeal Not Loaded");
    const [appealFormat, setAppealFormat] = useState({});
  let { id, name, rubricId } = router.query;


  async function setup() {
    try {
      const groupDataRes = await axios.get(`/api/groupEnrollments?assignmentId=${id}&userId=${userId}`);

      console.log({groupDataRes});

      const groupData = groupDataRes.data.data;

      let userSubmissions = [];

      if (groupData.length) {
        const submissionId = groupData[0].submissionId;

        console.log({submissionId});

        const results = await Promise.all([
          axios.get(`/api/submissions?submissionId=${submissionId}&assignmentId=${id}`),
          axios.get(`/api/peerReviews?assignmentId=${id}&submissionId=${submissionId}&done=true`),
          axios.get(formatRoot(props.ISstudent, userId) + `appeal?submissionId=${submissionId}&assignmentId=${id}`),
          axios.get(`/api/rubrics/${rubricId}`),
          axios.get(`/api/users?courseId=${courseId}`)
        ]);

        console.log({results});

        const [submissionsRes,reviewsRes,appealRes,rubricRes,usersRes] = results.map(r => r.data.data);

        const theRubric = rubricRes.rubric;
        console.log({theRubric});

        setSubmissions(submissionsRes);
        setPeerReviews(transformMatchings(
          reviewsRes.filter(({matchingType}) => matchingType === "initial"),
          theRubric,
          usersRes
        ));
        setTaReviews(transformMatchings(
          reviewsRes.filter(({matchingType}) => matchingType !== "initial"),
          theRubric,
          usersRes
        ));
        setAppeal(appealRes);
        setRubric(transformRubric(theRubric));

      }

    } catch (err) {
      console.log({err});
    }
  }

  useEffect(() => {
    setup();
  }, []);

  function getGrade(submission) {
    // if an appeal has a review, then calculate grade from it
    let gradedAppeals = appeal.filter(({review}) => !!review);
    if (gradedAppeals.length) {
       let total = _.sum(gradedAppeals[0].review.reviewBody.scores.map(([score,comment]) => score));
       return total + " (from appeal)";
    }

    if (!submission.grade)
      return "Ungraded";

    return submission.grade + (appeal.length ? " (pending appeal)" : "");
  }

  if (!rubric)
    return null;

  console.log({taReviews});


  return (
    <div className="Content">
      <Container name={"Submission Reports for " + name} >
          {
            submissions.map((sub,index) =>
              <Accordion key={`submission-${index}`}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                <Typography >Submission {index + 1}. Grade: {getGrade(sub)}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className={styles.details}>
                    {index === loadSRSubmission ?
                      sub.s3Link.includes('http') ? <iframe style={{ width:"100%",height:"100%",minHeight:"80vh"}} src={sub.s3Link}></iframe> : <Typography>{sub.s3Link}</Typography>
                      :
                        <Button onClick={() => setLoadSRSubmission(index)}>Load Submission</Button>
                      }

                      {!taReviews.length || <ReviewDisplayTableReadOnly
                        assignmentRubric={rubric}
                        peerMatchings={taReviews}
                        reviewerColumnTitle="TA Review"
                      />
                      }
                      <ReviewDisplayTableReadOnly
                        assignmentRubric={rubric}
                        peerMatchings={peerReviews}
                        reviewerColumnTitle="Peer Reviews"
                        anonymous="true"
                      />
                      <br />
                      <ToggleAppeal assignmentId={id} userId={userId} ISstudent={props.ISstudent} />
                    </div>
                </AccordionDetails>
              </Accordion>
            )
          }
        </Container>
        {/*
        <Container name={"Review Reports for " + name}>
        {
            revReports.map((rev, index) =>
              <Accordion key={JSON.stringify(rev)}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                <Typography >Peer Review {index + 1}. Grade: {getGrade(rev.report)}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className={styles.details}>
                    {index === loadRRSubmission ?
                      rev.s3Link.includes('http') ? <iframe style={{ width:"100%",height:"100%",minHeight:"80vh"}} src={rev.s3Link}></iframe> : <Typography>{rev.s3Link}</Typography>
                      :
                        <Button onClick={() => setLoadRRSubmission(index)}>Load Submission</Button>
                      }

                      <ReactMarkdown plugins={[gfm]} children={rev.report} />
                    </div>
                </AccordionDetails>
              </Accordion>
            )
          }
        </Container>
        */}
      <StudentViewOutline SetIsStudent={props.SetIsStudent}/>
    </div>
  );
}

export default ViewAssignmentGrade;
