import React, { useState, useEffect, useMemo } from "react";
import ListContainer from "../components/listcontainer";
import useSWR from "swr";

const fetcher = url => fetch(url, { method: "GET" }).then(r => r.json());

function AssignedReviews() {
  const [toDoReviews, setToDoReviews] = useState([]);
  const [pastReviews, setPastReviews] = useState([]);
  const courseId = 1;
  const userId = 1;
  const { data: res } = useSWR(
    `/api/assignments?courseId=${courseId}`,
    fetcher,
  );
  // use memoized val to prevent re-initialization of assignments arr
  const assignments = useMemo(() => (res ? res.data : []), [res]);

  useEffect(() => {
    (async () => {
      const currDate = new Date();
      const allReviews = await Promise.all(
        assignments.map(async assignment => {
          const res = await fetch(
            `/api/peerReviews?userId=${userId}&assignmentId=${assignment.id}`,
          );
          const resData = await res.json();
          return resData.data;
        }),
      );
      const toDoReviews = [];
      const pastReviews = [];
      for (let i = 0; i < assignments.length; i++) {
        const assignment = assignments[i];
        const peerReviews = allReviews[i];
        for (const peerReview of peerReviews) {
          if (new Date(assignment.reviewDueDate) >= currDate) {
            toDoReviews.push({
              name: `Submission ${peerReview.submissionId} — ${assignment.name}`,
              info: `Due: ${assignment.reviewDueDate}`,
              data: peerReview,
            });
          } else {
            pastReviews.push({
              name: `Submission ${peerReview.submissionId} — ${assignment.name}`,
              info: `Due: ${assignment.reviewDueDate}`,
              data: peerReview,
            });
          }
        }
        setToDoReviews(toDoReviews);
        setPastReviews(pastReviews);
      }
    })();
  }, [assignments]);

  return (
    <div className="Content">
      <ListContainer
        name="Peer Reviews Due"
        data={toDoReviews}
        link="/peer_reviews/peerreview"
      />
      <ListContainer name="Past Peer Reviews" data={pastReviews} link="" />
    </div>
  );
}

export default AssignedReviews;
