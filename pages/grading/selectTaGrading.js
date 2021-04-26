import React, { useState, useEffect } from "react";
import Container from "../../components/container";
import ListContainer from "../../components/listcontainer";
import StudentViewOutline from '../../components/studentViewOutline';
import { useUserData } from "../../components/storeAPI";
import { useRouter } from 'next/router';

const axios = require("axios");

const SelectTaGrading = (props) => {
  const router = useRouter();
  const { userId, courseId, courseName, assignment } = useUserData();
  const [toDoReviews, setToDoReviews] = useState([]);
  const [toDoGrades, setToDoGrades] = useState([]);
  var { assignmentName, assignmentId, name, id, rubricId } = router.query;
  if (!assignmentName) assignmentName = name;
  if (!assignmentId) assignmentId = id;
  // console.log({assignmentId})
  useEffect(() => {
    Promise.all([axios.get(`/api/submissions?assignmentId=${assignmentId}`), axios.get(`/api/peerReviews?assignmentId=${assignmentId}`)]).then(data => {
      console.log({data})
      const submissions = data[0].data.data;
      const allMatchings = data[1].data.data;
      console.log({allMatchings})

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
            console.log(match.reviewReview.reviewBody[0])
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
        if (sub.type == 'additional') {
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

    setToDoReviews(toDoReviews)
    setToDoGrades(toDoGrades)
  });
  }, []);

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

  return (
    <div className="Content">
        <TaToDoList toDoReviews={toDoReviews} />
        <TaToDoGrades toDoGrades={toDoGrades} />
        <StudentViewOutline isStudent={props.ISstudent} SetIsStudent={props.SetIsStudent} />
    </div>
  );
};

export default SelectTaGrading;

