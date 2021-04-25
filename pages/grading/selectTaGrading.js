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
    Promise.all([axios.get(`/api/submissions?assignmentId=${assignmentId}`), axios.get(`/api/peerReviews?assignmentId=${assignmentId}&userId=${userId}`)]).then(data => {
      console.log({data})
      const submissions = data[0].data.data;
      const taMatchings = data[1].data.data;
      console.log({taMatchings});
      let reviewReviews = [];
      let subMatch;
      taMatchings.forEach(match => {
        subMatch = submissions.filter(submission => submission.canvasId == match.submissionId);
        subMatch = subMatch.filter(submission => submission.assignmentId == assignmentId);
        console.log({match})
        reviewReviews.push({
          type: match.matchingType,
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
        if (sub.type == 'additional') {
          toDoGrades.push({
            name: "Grade group " + sub.submission.groupId + "'s submission",
            canvasId: assignmentId,
            rubricId: rubricId,
            // matchingId: sub.matchingId,
            data: {submissionId: sub.submission.canvasId, id: sub.matchingId},
        });
        } else {
          toDoReviews.push({
              name: "Grade group " + sub.submission.groupId + "'s reviews",
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

