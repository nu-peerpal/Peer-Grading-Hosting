import React, { useState, useEffect } from "react";
import Container from "../../components/container";
import ListContainer from "../../components/listcontainer";
import StudentViewOutline from '../../components/studentViewOutline';
import { useUserData } from "../../components/storeAPI";
import { useRouter } from 'next/router';
const axios = require("axios");
import _ from "lodash";
import {formatPrefix} from "../../components/apiCallUtils";

const SelectReview = (props) => {
  const router = useRouter();
  const { userId, courseId, courseName, assignment } = useUserData();
  const [toDoReviews, setToDoReviews] = useState([]);
  const { name, id, dueDate, rubricId, reviewStatus } = router.query;
  useEffect(() => {
    (async () => {
        let res = await axios.get(formatPrefix(props.ISstudent, userId) + `peerReviews?userId=${userId}&assignmentId=${id}`);
        // console.log({resData})
        const peerMatchings = res.data.data;
        peerMatchings.sort(function(a, b){return a.id-b.id})
        console.log({peerMatchings});

        const reviewReviewText = (reviewReview) => {
          if (!reviewReview)
            return "";

          const total = _.sum(reviewReview.reviewBody.map(({points}) => points));
          const maximum = _.sum(reviewReview.reviewBody.map(({maxPoints}) => maxPoints));

          return ` (Grade ${total}/${maximum})`;
        }

        const toDoReviews = peerMatchings.map((m,i) => ({
          name: `Submission ${i+1} ${reviewReviewText(m.reviewReview)}`,
          reviewDueDate: dueDate,
          rubricId,
          data: {...m,matchingId:m.id},
          reviewStatus: parseInt(reviewStatus),
          submissionAlias: i+1,
          actionItem: (parseInt(reviewStatus) < 6) ? "submit peer review by due date" : null
        }));

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
