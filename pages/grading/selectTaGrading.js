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
  var { assignmentName, assignmentId, name, id } = router.query;
  if (!assignmentName) assignmentName = name;
  if (!assignmentId) assignmentId = id;
  // console.log({assignmentId})
  useEffect(() => {
    Promise.all([axios.get(`/api/submissions?assignmentId=${assignmentId}`), axios.get(`/api/peerReviews?assignmentId=${assignmentId}&userId=${userId}`)]).then(data => {
      console.log({data})
      const submissions = data[0].data.data;
      const taMatchings = data[1].data.data;
      // console.log({completedReviews});
      let reviewReviews = [];
      let subMatch;
      taMatchings.forEach(match => {
        console.log({match})
        subMatch = submissions.filter(submission => submission.canvasId == match.submissionId);
        reviewReviews.push(subMatch[0]);
      });
      reviewReviews.sort(function(a, b){return a.groupId-b.groupId})

      const toDoReviews = [];
      console.log({reviewReviews})
      // toDoReviews.push({ name: name, assignmentDueDate: dueDate, data: peerMatchings });
      for (const sub of reviewReviews) {
        toDoReviews.push({
            name: "Grade group " + sub.groupId + "'s reviews",
            canvasId: assignmentId,
            data: {submissionId: sub.canvasId},
        });
      }

    setToDoReviews(toDoReviews)
  });
    // (async () => {
    //     let res = await axios.get(`/api/submissions?assignmentId=${assignmentId}`);
    //     console.log({res})
    //     const submissions = res.data.data;
    //     // console.log({completedReviews});
    //     submissions.sort(function(a, b){return a.groupId-b.groupId})

    //     const toDoReviews = [];
    //     // toDoReviews.push({ name: name, assignmentDueDate: dueDate, data: peerMatchings });
    //     for (const sub of submissions) {
    //       toDoReviews.push({
    //           name: "Grade group " + sub.groupId + "'s reviews",
    //           canvasId: assignmentId,
    //           data: {submissionId: sub.canvasId},
    //       });
    //     }

    // //   setToDoReviews(toDoReviews)
    // })().catch( e => { console.error(e) });
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

  return (
    <div className="Content">
        <TaToDoList toDoReviews={toDoReviews} />
        <StudentViewOutline isStudent={props.ISstudent} SetIsStudent={props.SetIsStudent} />
    </div>
  );
};

export default SelectTaGrading;

