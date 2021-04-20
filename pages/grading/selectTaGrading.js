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
  const { assignmentName, assignmentId, dueDate, rubricId } = router.query;
  useEffect(() => {
    (async () => {
        let res = await axios.get(`/api/peerReviews?assignmentId=${assignmentId}&done=true`);
        // console.log({resData})
        const completedReviews = res.data.data;
        // console.log({completedReviews});
        completedReviews.sort(function(a, b){return a.id-b.id})
        console.log({completedReviews});

        const toDoReviews = [];
        // toDoReviews.push({ name: name, assignmentDueDate: dueDate, data: peerMatchings });
        let reviewIndex = 0;
        for (const peerMatching of completedReviews) {
          toDoReviews.push({
              name: "Grade user " + peerMatching.userId + "'s review",
              canvasId: peerMatching.assignmentId,
              data: peerMatching,
              submissionAlias: peerMatching.userId
          });
        }

      setToDoReviews(toDoReviews)
    })().catch( e => { console.error(e) });
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
    </div>
  );
};

export default SelectTaGrading;

