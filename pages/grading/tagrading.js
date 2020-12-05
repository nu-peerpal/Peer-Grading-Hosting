import React, { useState, useEffect } from "react";
import "./tagrading.module.css";
import Container from "../../components/container";
import TAsubmission from "../../components/TAgradingview";
import useSWR from "swr";

const fetcher = url => fetch(url).then(res => res.json());

/* sample transformed peerMatching:
{
  user_id: 1,
  review: [
    {
      points: 9,
      maxPoints: 10,
      element: "Answer/Algorithm",
      comment: "Great algorithm!"
    },
    {
      points: 8,
      maxPoints: 10,
      element: "Proof Analysis",
      comment: "Proof could be better..."
    }
  ],
  lastName: "Ramos",
  firstName: "Bradley"
}

sample transformed rubric:
[
  { maxPoints: 10, element: "Quantitative" },
  { maxPoints: 10, element: "Qualitative" }
] */

const transformRubric = rubric =>
  rubric.map(([maxPoints, element]) => ({ maxPoints, element }));
const transformMatchings = (matchings, assignmentRubric, users) =>
  matchings.map(matching => {
    const { firstName, lastName } = users.find(
      user => user.id === matching.userId
    );
    const reviewScoreComments = matching.review.scores;
    const transformedReview = reviewScoreComments.map(
      ([points, comment], i) => ({
        points,
        comment,
        maxPoints: assignmentRubric[i][0],
        element: assignmentRubric[i][1]
      })
    );
    return {
      userId: matching.userId,
      review: transformedReview,
      firstName,
      lastName
    };
  });

const TAGrading = () => {
  const [rawRubric, setRawRubric] = useState([]);
  const [rubric, setRubric] = useState([]);
  const [reviewRubric, setReviewRubric] = useState([]);
  const [peerMatchings, setPeerMatchings] = useState([]);

  // NOTE: need to change when using real matchings in database
  const assignmentId = 1;
  const submissionId = 1;
  const courseId = 1;

  const { data: assignmentRes } = useSWR(
    `/api/assignments/${assignmentId}`,
    fetcher
  );
  const { data: matchingsRes } = useSWR(
    `/api/peerReviews?assignmentId=${assignmentId}&done=true`,
    fetcher
  );
  const { data: usersRes } = useSWR(`/api/users?courseId=${courseId}`, fetcher);

  useEffect(() => {
    (async () => {
      if (assignmentRes) {
        const [rubricRes, reviewRubricRes] = await Promise.all(
          [
            `/api/rubrics/${assignmentRes.data.rubricId}`,
            `/api/rubrics/${assignmentRes.data.reviewRubricId}`
          ].map(fetcher)
        );
        setRawRubric(rubricRes.data.rubric);
        setRubric(transformRubric(rubricRes.data.rubric));
        setReviewRubric(transformRubric(reviewRubricRes.data.rubric));
      }
    })();
  }, [assignmentRes]);

  useEffect(() => {
    if (matchingsRes && usersRes && rawRubric.length > 0) {
      const peerMatchings = matchingsRes.data.filter(
        matching => matching.submissionId === submissionId
      );
      setPeerMatchings(
        transformMatchings(peerMatchings, rawRubric, usersRes.data)
      );
    }
  }, [matchingsRes, usersRes, rawRubric]);

  return (
    <div className="Content">
      <Container name="TA Grading">
        <TAsubmission
          assignmentRubric={rubric}
          reviewRubric={reviewRubric}
          peerMatchings={peerMatchings}
        />
      </Container>
    </div>
  );
};

export default TAGrading;
