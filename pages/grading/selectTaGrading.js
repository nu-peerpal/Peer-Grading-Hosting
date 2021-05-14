import React, { useState, useEffect } from "react";
import Container from "../../components/container";
import ListContainer from "../../components/listcontainer";
import Switch from '@material-ui/core/Switch';
import StudentViewOutline from '../../components/studentViewOutline';
import { useUserData } from "../../components/storeAPI";
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Button from "@material-ui/core/Button";

const axios = require("axios");

const SelectTaGrading = (props) => {
  const router = useRouter();
  const { userId, courseId, courseName, assignment, createUser, savedStudentId } = useUserData();
  const [toDoReviews, setToDoReviews] = useState([]);
  const [toDoGrades, setToDoGrades] = useState([]);
  const [assignmentDetails, setAssignmentDetails] = useState();
  const [reviewsCompleted, setReviewsCompleted] = useState(false);
  const [completedConfirmed, setCompletedConfirmed] = useState(false);
  const [reviewStatusSet, setReviewStatusSet] = useState();
  const [userDataUpdated, setUserDataUpdated] = useState(false);
  var { assignmentName, assignmentId, name, id, rubricId } = router.query;
  if (!assignmentName) assignmentName = name;
  if (!assignmentId) assignmentId = id;
  // console.log({assignmentId})
  useEffect(() => {
    if (!userId) { // check if state isn't active
      if (Cookies.get('userData') && !savedStudentId) { // create new user if not viewing as student and cookie is set
        console.log('recreating user data');
        const userData = JSON.parse(Cookies.get('userData'));
        createUser(userData);
        setUserDataUpdated(!userDataUpdated);
      }
    }
  }, []);
  useEffect(() => {
    Promise.all([axios.get(`/api/submissions?assignmentId=${assignmentId}`), axios.get(`/api/peerReviews?assignmentId=${assignmentId}`), axios.get(`/api/assignments/${assignmentId}`)]).then(data => {
      console.log({data})
      const submissions = data[0].data.data;
      const allMatchings = data[1].data.data;
      const assignmentData = data[2].data.data;
      setAssignmentDetails(assignmentData);
      // console.log({allMatchings})

      const taMatchings = data[1].data.data.filter(match => match.userId == userId);
      // console.log({taMatchings});
      let reviewReviews = [];
      let subMatch, revMatches;
      taMatchings.forEach(match => {
        subMatch = submissions.filter(submission => (submission.canvasId == match.submissionId && submission.assignmentId == match.assignmentId));
        revMatches = allMatchings.filter(matching => (matching.submissionId == subMatch[0].canvasId && matching.assignmentId == assignmentId));
        // console.log({revMatches})
        // console.log({subMatch})
        let graded = false;
        let allGraded = [];
        revMatches.forEach(match => {
          if (match.reviewReview && match.userId != userId) {
            graded = true;
            // console.log(match.reviewReview.reviewBody[0])
            if (match.reviewReview.reviewBody[0].points === ""){
              allGraded.push(false); // if empty review (not even 0) then it must not be graded
            } else {
              allGraded.push(true);
            }
          }
        });
        // console.log({allGraded})
        if (allGraded.includes(false)) {
          allGraded = false;
        } else {
          allGraded = true;
        }
        // subMatch = subMatch.filter(submission => submission.assignmentId == assignmentId);
        // console.log({match})
        reviewReviews.push({
          type: match.matchingType,
          done: [match.review!=null, graded, allGraded],
          matchingId: match.id,
          submission: subMatch[0]
        });
      });
      reviewReviews.sort(function(a, b){return a.groupId-b.groupId})

      const toDoReviews = [];
      const toDoGrades = []
      console.log({reviewReviews})
      // toDoReviews.push({ name: name, assignmentDueDate: dueDate, data: peerMatchings });
      for (const sub of reviewReviews) {
        let finished = "";
        if (sub.type == 'additional' || sub.type == 'appeal') {
          if (sub.done[0]) {
            finished = " (completed)"; // if anything was submitted, algo has data to run
          }
          toDoGrades.push({
            name: "Grade group " + sub.submission.groupId + "'s submission" + finished,
            canvasId: assignmentId,
            rubricId: rubricId,
            // matchingId: sub.matchingId,
            data: {submissionId: sub.submission.canvasId, id: sub.matchingId},
          });
        } else {
          if (sub.done[1]) {
            if (sub.done[2]) { // if all done
              finished = " (completed)";
            } else { // just submitted
              finished = " (submitted)";
            }
          }
          toDoReviews.push({
              name: "Grade group " + sub.submission.groupId + "'s reviews" + finished,
              canvasId: assignmentId,
              data: {submissionId: sub.submission.canvasId},
          });
        }
      }
    
    // console.log(reviewReviews.filter(review => review.done[2] == true));
    // console.log(reviewReviews.filter(review => (review.done[0] == false && review.type == 'additional')))
    // console.log(reviewReviews.filter(review => review.done[2] == false))
    let tempFlag = false;
    console.log((reviewReviews.filter(review => (review.done[0] == false && (review.type == 'additional' || review.type == 'appeal'))).length == 0));
    if ((reviewReviews.filter(review => review.done[2] == false).length == 0) && (reviewReviews.filter(review => (review.done[0] == false && (review.type == 'additional' || review.type == 'appeal'))).length == 0)) {
      setReviewsCompleted(true)
      tempFlag = true;
    }
    console.log({tempFlag})
    if (assignmentData.reviewStatus >= 6) {
      if (tempFlag) {
        if (assignmentData.reviewStatus == 6) {
          setCompletedConfirmed(true);
        }
        if (assignmentData.reviewStatus == 8) {
          setCompletedConfirmed(true);
        }
      } else {
        setCompletedConfirmed(false);
        if (assignmentData.reviewStatus == 6) { // on reports, go back to TA grading
          console.log('New reviews found: reverting review status to TA Grading.')
          axios.patch(`/api/assignments/${assignmentId}`, {reviewStatus: 5});
        } else { // should be on appeals
          if (assignmentData.reviewStatus > 7) {
            console.log('New reviews found: reverting review status to appeals.')
            axios.patch(`/api/assignments/${assignmentId}`, {reviewStatus: 7});
          }
        }
      }
    }

    setToDoReviews(toDoReviews)
    setToDoGrades(toDoGrades)

  });
  }, [userDataUpdated]);

  function TaToDoList(props) {
    if (props.toDoReviews) {
      return <ListContainer
      name={"Review reviews to Complete for: " + assignmentName}
      data={props.toDoReviews}
      link="/grading/tagrading"
    />
    } else {
      return null;
    }
  }
  function TaToDoGrades(props) {
    if (props.toDoGrades) {
      return <ListContainer
      name={"TA reviews to Complete for: " + assignmentName}
      data={props.toDoGrades}
      link="/peer_reviews/peerreview"
    />
    } else {
      return null;
    }
  }

  function handleCompleted() {
    if (!completedConfirmed) { // finished grading
      setCompletedConfirmed(true);
      if (assignmentDetails.reviewStatus == 5) {
        axios.patch(`/api/assignments/${assignmentId}`, {reviewStatus: 6});
      }
      if (assignmentDetails.reviewStatus == 7) {
        axios.patch(`/api/assignments/${assignmentId}`, {reviewStatus: 8});
      }
      setReviewStatusSet("Confirmed");
    } else { // no longer finished grading
      setCompletedConfirmed(false);
      if (assignmentDetails.reviewStatus == 6) {
        axios.patch(`/api/assignments/${assignmentId}`, {reviewStatus: 5});
      }
      if (assignmentDetails.reviewStatus == 8) {
        axios.patch(`/api/assignments/${assignmentId}`, {reviewStatus: 7});
      }
      // axios.patch(`/api/assignments/${assignmentId}`, {reviewStatus: 5});
      setReviewStatusSet("No longer confirmed");
    }
  }

  return (
    <div className="Content">
        <TaToDoList toDoReviews={toDoReviews} />
        <TaToDoGrades toDoGrades={toDoGrades} />
        <StudentViewOutline isStudent={props.ISstudent} SetIsStudent={props.SetIsStudent} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }} >
          {/* <Button disabled={!reviewsCompleted || reviewStatusSet=="Confirmed"} onClick={handleCompleted}>
            Confirm Grading is Completed
          </Button> */}
          {reviewsCompleted ? <div>Grading completed?
              <Switch
                checked={completedConfirmed}
                onChange={handleCompleted}
                color="primary"
                name="confirmGrading"
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            </div> : <div>Grading not yet completed.</div>
          }
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }} >
          {reviewStatusSet}
        </div>
    </div>
  );
};

export default SelectTaGrading;

