import React, { useState, useEffect } from "react";
import Container from "../../components/container";
import ListContainer from "../../components/listcontainer";
import Switch from '@material-ui/core/Switch';
import StudentViewOutline from '../../components/studentViewOutline';
import { useUserData } from "../../components/storeAPI";
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Button from "@material-ui/core/Button";
import _ from "lodash";

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
    Promise.all([
      axios.get(`/api/submissions?assignmentId=${assignmentId}`),
      axios.get(`/api/peerReviews?assignmentId=${assignmentId}`),
      axios.get(`/api/assignments/${assignmentId}`),
      axios.get(`/api/groupEnrollments?assignmentId=${assignmentId}`)
    ]).then(data => {
      console.log({data})
      const submissions = data[0].data.data;
      const allMatchings = data[1].data.data;
      const assignmentData = data[2].data.data;
      const groupData = data[3].data.data;
      console.log({groupData});
      setAssignmentDetails(assignmentData);

      const taMatchings = data[1].data.data.filter(match => match.userId == userId);
      let reviewReviews = [];
      let subMatch, revMatches;
      taMatchings.forEach(match => { // for each grader matching
        // find submission
        subMatch = submissions.filter(submission => (submission.canvasId == match.submissionId && submission.assignmentId == match.assignmentId));
        // find peer review
        revMatches = allMatchings.filter(matching => (matching.submissionId == subMatch[0].canvasId && matching.assignmentId == assignmentId));
        let graded = false;
        let allGraded = [];
        revMatches.forEach(match => {
          if (match.reviewReview && match.userId !== userId) { // if reviewReview exists then you already completed it
            graded = true;
            if (match.reviewReview.reviewBody[0].points === ""){
              allGraded.push(false); // if empty review (not even 0) then it must not be graded
              console.log('grading not complete at',{match});
            } else {
              allGraded.push(true);
            }
          }
        });
        allGraded = !allGraded.includes(false);

        // subMatch = subMatch.filter(submission => submission.assignmentId == assignmentId);
        reviewReviews.push({
          type: match.matchingType,
          done: [match.review!=null, graded, allGraded],
          matchingId: match.id,
          submission: subMatch[0]
        });
      });
      reviewReviews.sort(function(a, b){return a.matchingId-b.matchingId})

      const toDoReviews = [];
      const toDoGrades = []
      console.log({reviewReviews})
      // toDoReviews.push({ name: name, assignmentDueDate: dueDate, data: peerMatchings });
      for (const sub of reviewReviews) {
        let finished = "";
        let groupMembers = groupData.filter(x => parseInt(sub.submission.canvasId) == x.submissionId);
        if (sub.type == 'additional' || sub.type == 'appeal') {
          if (sub.done[0]) {
            finished = "(completed)"; // if anything was submitted, algo has data to run
          }
          toDoGrades.push({
            name: `Grade group ${sub.submission.canvasId}'s submission ${finished}`,
            canvasId: assignmentId,
            rubricId: rubricId,
            // matchingId: sub.matchingId,
            data: {submissionId: sub.submission.canvasId, matchingId: sub.matchingId},
          });
        } else {
          if (sub.done[1]) {
            if (sub.done[2]) { // if all done
              finished = "(completed)";
            } else { // just submitted
              finished = "(submitted)";
            }
          }
          toDoReviews.push({
              name: `Grade group ${sub.submission.canvasId}'s submission ${finished}`,
              canvasId: assignmentId,
              rubricId: rubricId,
              data: {submissionId: sub.submission.canvasId, matchingId: sub.matchingId},
          });
        }

        // if (sub.type == 'appeal') {
        //   matchingsFromAppeals.push({
        //     name: "Grade group " + sub.submission.groupId + "'s submission" + finished,
        //     canvasId: assignmentId,
        //     rubricId: rubricId,
        //     // matchingId: sub.matchingId,
        //     data: {submissionId: sub.submission.canvasId, id: sub.matchingId},
        //   })
        // }

      }
      console.log({toDoReviews})
    let tempFlag = false;
    // console.log((reviewReviews.filter(review => (review.done[0] == false && (review.type == 'additional' || review.type == 'appeal'))).length == 0));
    if ((reviewReviews.filter(review => review.done[2] == false).length == 0) && (reviewReviews.filter(review => (review.done[0] == false && (review.type == 'additional' || review.type == 'appeal'))).length == 0)) {
      setReviewsCompleted(true)
      tempFlag = true;
    }
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

    setToDoReviews(toDoReviews);
    setToDoGrades(_.uniqBy(toDoGrades,(tdg) => tdg.data.submissionId));

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

  async function handleCompleted() {
    if (!completedConfirmed) { // finished grading
      setCompletedConfirmed(true);
      let notif = '';
      let subject = '';
      if (assignmentDetails.reviewStatus == 5) {
        axios.patch(`/api/assignments/${assignmentId}`, {reviewStatus: 6});
        notif = 'TA has completed TA reviews.'
        subject = 'Completed TA reviews'
      }
      if (assignmentDetails.reviewStatus == 7) {
        axios.patch(`/api/assignments/${assignmentId}`, {reviewStatus: 8});
        notif = 'TA has completed appeal reviews.'
        subject = 'Completed appeal reviews'
      }
      setReviewStatusSet("Confirmed");

      // // Notify instructor when TA reviews or appeals are complete
      // let instructors = await axios.get(`/api/users?courseId=${courseId}&enrollment=InstructorEnrollment`)
      // console.log('instructors:',instructors);
      //   Promise.all([
      //     axios.post(`/api/sendemail?type=appealsComplete&courseId=${courseId}`, {
      //       userId: instructors.data.data[0].id,
      //       subject: subject,
      //       message: notif
      //     })
      //   ]).then(res => {console.log('res:',res)
      //       }).catch(err => console.log('err:',err))

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
        {!toDoReviews || <TaToDoList toDoReviews={toDoReviews} />}
        {!toDoGrades || <TaToDoGrades toDoGrades={toDoGrades} />}
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
        <StudentViewOutline isStudent={props.ISstudent} SetIsStudent={props.SetIsStudent} />
    </div>
  );
};

export default SelectTaGrading;
