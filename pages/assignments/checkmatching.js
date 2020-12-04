import React, { useState, useEffect } from "react";
import Container from "../../components/container";
import Tree from "../../components/tree";
import sampleData from "../../sample_data/ensureSufficientReviews";
import { ensureSufficientReviews } from "../api/AlgCalls.js";

// Note: following imports should be used with the commented-out
// code below after real data is populated in database.
import useSWR from "swr";
const fetcher = url => fetch(url, { method: "GET" }).then(r => r.json());

function CheckMatching() {
  // NOTE: The following code should be removed upon usage of real data.
  const { graders, reviews, matching } = sampleData;

  /* NOTE: The following code should be used when real data populated in database.
  const courseId = 1;
  const assignmentId = 1;

  const { data: usersRes } = useSWR(
    `/api/users?courseId=${courseId}&assignmentId=${assignmentId}`,
    fetcher
  );
  const { data: completeReviewsRes } = useSWR(
    `/api/peerReviews?done=true&assignmentId=${assignmentId}`
  );
  const { data: allMatchingsRes } = useSWR(
    `/api/peerReviews?assignmentId=${assignmentId}`
  );

  let graders, reviews, matching;
  graders = reviews = matching = [];
  if (usersRes && completeReviewsRes && allMatchingsRes) {
    graders = usersRes.data.map(user => user.id);
    reviews = completeReviewsRes.data.map(
      ({ submissionId, userId, review }) => [userId, submissionId, review] // format as algorithm input
    );
    matching = allMatchingsRes.data.map(({ submissionId, userId }) => [
      userId,
      submissionId
    ]); // format as algorithm input
  } */

  const [additionalMatchings, setAdditionalMatchings] = useState([]);
  useEffect(() => {
    (async () => {
      const matchings = await ensureSufficientReviews(
        graders,
        reviews,
        matching
      );
      setAdditionalMatchings(matchings);
    })();
  }, [graders, reviews, matching]);

  return (
    <div className="Content">
      <Container name="Additional Matches">
        <Tree response={additionalMatchings} />
      </Container>
    </div>
  );
  // }
}

export default CheckMatching;
