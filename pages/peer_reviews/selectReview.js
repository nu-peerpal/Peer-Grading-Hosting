import React, { useState, useEffect } from "react";
import Container from "../../components/container";
import ListContainer from "../../components/listcontainer";
import StudentViewOutline from '../../components/studentViewOutline';
import { useUserData } from "../../components/storeAPI";
import { useRouter } from 'next/router';
const axios = require("axios");

const SelectReview = (props) => {
  const router = useRouter();
  const { userId, courseId, courseName, assignment } = useUserData();
  const [toDoReviews, setToDoReviews] = useState([]);
  const { name, id, dueDate, rubricId } = router.query;
  useEffect(() => {
    (async () => {
        let res = await axios.get(`/api/peerReviews?userId=${userId}&assignmentId=${id}`);
        // console.log({resData})
        const peerMatchings = res.data.data;
        console.log({peerMatchings});
        peerMatchings.sort(function(a, b){return a.id-b.id})
        console.log({peerMatchings});

        const toDoReviews = [];
        // toDoReviews.push({ name: name, assignmentDueDate: dueDate, data: peerMatchings });
        let reviewIndex = 0;
        for (const peerMatching of peerMatchings) {
          reviewIndex = reviewIndex + 1;
          toDoReviews.push({
              name: "Submission " + reviewIndex,
              assignmentDueDate: dueDate,
              rubricId: rubricId,
              data: peerMatching,
              submissionAlias: reviewIndex
          });
        }

      setToDoReviews(toDoReviews)
    })().catch( e => { console.error(e) });
  }, []);

  function StudentToDoList(props) {
    if (props.toDoReviews) {
      return <ListContainer
        textIfEmpty="no peer reviews have been assigned"
        name={"Reviews for " + name}
        data={props.toDoReviews}
        student={props.ISstudent}
        link="/peer_reviews/peerreview"
    />
    } else {
      return null;
    }
  }

  return (
    <div className="Content">
        <StudentToDoList toDoReviews={toDoReviews} ISstudent={props.ISstudent} />
        <StudentViewOutline SetIsStudent={props.SetIsStudent} />
    </div>
  );
};

export default SelectReview;
