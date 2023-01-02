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
const ReactMarkdown = require('react-markdown');
const gfm = require('remark-gfm');
const axios = require("axios");

function ToggleAppeal(props) {
  const [eligibleAppeal, setEligibleAppeal] = useState();
  const [appealReview, setAppealReview] = useState({});
  const [appealReviewed, setAppealReviewed] = useState(false);
  const [appealAvailable, setAppealAvailable] = useState(false);
  const [appealButtonText, setAppealButtonText] = useState("Appeal Not Loaded");
  const id = props.assignmentId;
  const userId = props.userId;

  async function setup() {
    try {
      const results = await Promise.all([
        axios.get(`/api/assignments/${id}`),
        axios.get(`/api/peerReviews?assignmentId=${id}&submitterId=${userId}&matchingType=appeal`),
        axios.get(`/api/groupEnrollments?assignmentId=${id}&userId=${userId}`)
      ]);
      console.log({results});

      const [assignmentRes,taReviews,appealReviews] = results.map(r => r.data.data);

      let userSubmissions = [];

      // if the appeal is already reviewed, then it cannot be un-appealed.
      if (appealReviews.length && appealReviews.filter(({review}) => review).length)
        setAppealReviewed(true);

      if (taReviews.length)
        setEligibleAppeal(true);

      if (assignmentRes.appealsDueDate) {
        let today = new Date();
        let dueDate = new Date(assignmentRes.appealsDueDate);
        if (today < dueDate) {
          if (appealReviews.length) { // if appeal already exists
            setAppealAvailable(false);
            setAppealButtonText('Appeal Submitted');
            setAppealReview(appealReviews[0]); // assuming one appeal
          } else {
            setAppealAvailable(true);
            setAppealButtonText("Submit Appeal")
          }
        } else {
          setAppealAvailable(false);
          setAppealButtonText("Appeals Deadline Passed")
        }
      } else {
        setAppealAvailable(false);
        setAppealButtonText("Appeals not set for assignment yet")
      }
    } catch (err) {
      console.log({err});
    }
  }

  useEffect(() => {
    setup();
  }, []);

  async function handleAppeal() {
    if (!appealAvailable)
      return;

    console.log('handling appeal');
    // Jason: Should this email the TA?


    try {
      const appealResponse = await axios.put(`/api/appeal?userId=${userId}&assignmentId=${id}`);
      if (appealResponse.status == 201) {
        console.log("appeal set", appealResponse.data);
        setAppealAvailable(false);
        setAppealButtonText('Appeal Submitted');
      } else {
        setAppealButtonText('Something Went Wrong. Try again');
        console.log('appeal error',appealResponse);
      }
    } catch (err) {
      setAppealButtonText('Something Went Wrong. Try again');
      console.log('appeal error',err)
    }
  }

  async function removeAppeal() {

    console.log('removing appeal');

    let res = await axios.delete(`/api/appeal?userId=${userId}&assignmentId=${id}`);
    if (res.status == 200) {
      setAppealAvailable(true);
      setAppealButtonText("Submit Appeal");
    } else {
      setAppealButtonText('Something Went Wrong. Try again');
    }
    console.log('appeal',{res});
  }

  if (appealReviewed)
    return (
      <div>
        <span className={styles.disclaimer}>
          The appeal for this submission has been graded.  It may not be appealed again.  It may not be un-appealed.
        </span>
      </div>
    );

  if (eligibleAppeal)
    return (
      <div className={styles.disclaimer}>
        <div>
          This submission is eligible for appeal. If you submit an appeal,
          you will lose any bonus added to your current score and receive a TA grade instead.
        </div>
        <br />
        <span><b>Note:</b> submitting an appeal applies to all members in your group.</span>
        <div>
          <Button disabled={!appealAvailable} onClick={handleAppeal}>{appealButtonText}</Button>
            {appealReview && <Button onClick={removeAppeal}>Cancel</Button>}
        </div>
      </div>
    );

  return (
    <div>
      <span className={styles.disclaimer}>This submission is not eligible for appeal
      because you have already received a TA grade. If you would like to submit a regrade request,
      see Canvas for more information on how to do that.
      </span>
    </div>
  );
}

export default ToggleAppeal;
