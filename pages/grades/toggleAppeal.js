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
import { useUserData } from "../../components/storeAPI";
import { useRouter } from 'next/router';
import {formatPrefix} from "../../components/apiCallUtils";
const ReactMarkdown = require('react-markdown');
const gfm = require('remark-gfm');
const axios = require("axios");

function ToggleAppeal(props) {
  const [isAppealed, setIsAppealed] = useState(false);
  const [appealReview, setAppealReview] = useState({});
  const [appealReviewed, setAppealReviewed] = useState(false);
  const [appealUnavailable, setAppealUnavailable] = useState(null);
  const [appealButtonText, setAppealButtonText] = useState("");
  const id = props.assignmentId;
  const userId = props.userId;


  async function setup() {
    try {
      const results = await Promise.all([
        axios.get(formatPrefix(props.ISstudent, userId) + `assignments/${id}`),
        axios.get(`/api/peerReviews?assignmentId=${id}&submitterId=${userId}`)
      ]);

      const [assignmentRes,allReviews] = results.map(r => r.data.data);

      const taReviews = allReviews.filter(({matchingType}) => matchingType !== "initial");
      const appealReviews = taReviews.filter(({matchingType}) => matchingType === "appeal");
      const priorTaReviews = taReviews.filter(({matchingType}) => matchingType !== "appeal");

      let userSubmissions = [];

      const appealFinished = !!appealReviews.filter(({review}) => review).length;

      // if the appeal is already reviewed, then it cannot be un-appealed.
      if (appealFinished)
      {
        setAppealUnavailable("the appeal has already been reviewed by and cannot be canceled")
        setAppealReviewed(true);
      }

      if (priorTaReviews.length)
      {
        setAppealUnavailable("submission has been reviewed by a TA and is not available for appeal")
      }

      if (!assignmentRes.appealsDueDate)
        setAppealUnavailable("appeals have not yet been configured for this assignment");

      if (new Date() > new Date(assignmentRes.appealsDueDate))
        setAppealUnavailable("due date for appeals has passed and appeals cannot be made or canceled");

      setIsAppealed(!!appealReviews.length);

    } catch (err) {
      console.log({err});
    }
  }

  useEffect(() => {
    setup();
  }, []);


  async function handleAppeal() {
    if (isAppealed) {
      await removeAppeal();
    } else {
      await requestAppeal();
    }
  }

  async function requestAppeal() {
    if (appealUnavailable)
      return;

    console.log('handling appeal');
    // Jason: Should this email the TA?


    try {
      const appealResponse = await axios.put(formatPrefix(props.ISstudent, userId) + `appeal?userId=${userId}&assignmentId=${id}`);
      if (appealResponse.status == 201) {
        setIsAppealed(true);
        setAppealButtonText('');
      } else {
        setAppealButtonText('Something Went Wrong. Try again');
        console.log('appeal error',{appealResponse});
      }
    } catch (err) {
      setAppealButtonText('Something Went Wrong. Try again');
      console.log('appeal request failed',{err})
    }
  }

  async function removeAppeal() {

    console.log('removing appeal');

    try {

      let res = await axios.delete(formatPrefix(props.ISstudent, userId) + `appeal?userId=${userId}&assignmentId=${id}`);
      if (res.status == 200) {
        setIsAppealed(false);
        setAppealButtonText('');
      } else {
        setAppealButtonText('Something Went Wrong. Try again');
        console.log('appeal cancel failed',{res});
      }
    } catch (err) {
      setAppealButtonText('Something Went Wrong. Try again');
      console.log('appeal request failed',{err})
    }
  }

  if (!appealUnavailable)
    return (
      <div className={styles.disclaimer}>
        <div>
          {isAppealed
            ? "This submission has been appealed.  An instructor will review the submission and determine its grade. Any bonus included in your current score will be lost."
            : "This submission is eligible for appeal.  If you submit an appeal, you will lose any bonus added to your current score and receive a TA grade instead."
          }
        </div>
        <br />
        <span><b>Note:</b> an appeal applies to all members of a group submission.</span>
        <div>
          <Button onClick={handleAppeal}>{isAppealed ? "Cancel Appeal": "Request Appeal"}</Button>
          {appealButtonText}
        </div>
      </div>
    );

  return (
    <div>
      <span className={styles.disclaimer}> This submission is not eligible for appeal
      because {appealUnavailable}.
      </span>
    </div>
  );
}

export default ToggleAppeal;
